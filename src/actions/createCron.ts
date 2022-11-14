import { ViewSubmitAction } from '@slack/bolt';
import axios from 'axios';

import { handleSchedule } from '@/bootstrap/schedule';
import { OPEN_MODAL, repeatDailyPrefix, timePickerSuffix } from '@/commands/daily/openModal';
import { SELECT_AT_LEAST_ONE_WEEKDAY, WAS_CREATED, YOUR_CRON } from '@/i18n';
import { scheduleMultiple } from '@/services/cron';
import { createLogger } from '@/services/logger';
import { parseMetadata } from '@/services/metadata';
import { repository } from '@/services/repository';
import { slack as app } from '@/services/slack';

const logger = createLogger();

app.view<ViewSubmitAction>({ type: 'view_submission', callback_id: OPEN_MODAL }, async ({ ack, body }) => {
  const team = body.view.team_id;
  const metadata = parseMetadata(body.view.private_metadata);
  const responseUrl = metadata.r;
  const channel = metadata.c;

  const inputs = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((weekday) => {
    const block = body.view.state.values[`${repeatDailyPrefix}_${weekday}`];
    const action = block[`${weekday}_${timePickerSuffix}`];
    return { value: action.selected_time, weekday };
  });

  const areAllInputsEmpty = inputs.every((input) => !input.value);
  if (areAllInputsEmpty) {
    await ack({
      response_action: 'errors',
      errors: {
        repeat_daily_monday: SELECT_AT_LEAST_ONE_WEEKDAY,
      },
    });
    return;
  }

  const intervals = inputs
    .filter((i) => i.value != null)
    .map((i) => {
      const [hour, minute] = (i.value as string).split(':');
      const input = { ...i, value: { hour, minute } };
      const dayWeek = input.weekday.slice(0, 3).toUpperCase();
      return `0 ${minute} ${hour} * * ${dayWeek}`;
    });

  const cron = await repository.persistCron({
    team,
    responseUrl,
    channel,
    intervals,
    name: body.view.state.values.name.name_input.value as string,
    users: body.view.state.values.participants.participants_select.selected_users ?? [],
  });

  scheduleMultiple([cron], (cron) => {
    logger.debug({ hint: 'cron is running', cron });

    handleSchedule(cron);
  });

  logger.debug({ hint: 'cron is scheduled', cron });

  await axios.post(responseUrl, {
    user: body.user.id,
    text: `${YOUR_CRON} "${cron.name}" ${WAS_CREATED}`,
    response_type: 'ephemeral',
  });

  logger.debug({ hint: 'slack message is sent', cron });

  await ack();
});
