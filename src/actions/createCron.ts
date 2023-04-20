import { ViewSubmitAction } from '@slack/bolt';

import { handleSchedule } from '@/bootstrap/schedule';
import { CREATE_CRON, MESSAGE_INPUT_ACTION, repeatDailyPrefix, timePickerSuffix } from '@/constants';
import { SELECT_AT_LEAST_ONE_WEEKDAY } from '@/i18n';
import { scheduleMultiple } from '@/services/cron';
import { createLogger } from '@/services/logger';
import { parseMetadata } from '@/services/metadata';
import { repository } from '@/services/repository';
import { app } from '@/services/slack';
import { postConfirmationMessage } from '@/services/slack/functions/postConfirmationMessage';

const logger = createLogger();

app.view<ViewSubmitAction>({ type: 'view_submission', callback_id: CREATE_CRON }, async ({ ack, body, client }) => {
  const team = body.view.team_id;
  const metadata = parseMetadata(body.view.private_metadata);
  const channel = metadata.c;

  const inputs = getInputs(body);

  const areAllInputsEmpty = inputs.every((input) => !input.value);
  if (areAllInputsEmpty) {
    await ack({ response_action: 'errors', errors: { repeat_daily_monday: SELECT_AT_LEAST_ONE_WEEKDAY } });
    return;
  }

  const intervals = getIntervals(inputs);

  const message = body.view.state.values.message[MESSAGE_INPUT_ACTION].value as string;

  const cron = await repository.persistCron({
    team,
    channel,
    intervals,
    name: body.view.state.values.name.name_input.value as string,
    users: body.view.state.values.participants.participants_select.selected_users ?? [],
    author: body.user.id,
    message,
  });

  scheduleMultiple([cron], (cron) => {
    logger.debug({ hint: 'cron is running', cron });

    void handleSchedule(cron.id);
  });

  logger.debug({ hint: 'cron is scheduled', cron });

  await postConfirmationMessage({
    client,
    channel,
    body,
    cron,
    ack,
  });

  logger.debug({ hint: 'slack message is sent', cron });

  await ack();
});

export function getIntervals(inputs: { value: string | null | undefined; weekday: string }[]) {
  return inputs
    .filter((i) => i.value != null)
    .map((i) => {
      const [hour, minute] = (i.value as string).split(':');
      const input = { ...i, value: { hour, minute } };
      const dayWeek = input.weekday.slice(0, 3).toUpperCase();
      return `0 ${minute} ${hour} * * ${dayWeek}`;
    });
}

export function getInputs(body: ViewSubmitAction) {
  return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((weekday) => {
    const block = body.view.state.values[`${repeatDailyPrefix}_${weekday}`];
    const action = block[`${weekday}_${timePickerSuffix}`];
    return { value: action.selected_time, weekday };
  });
}
