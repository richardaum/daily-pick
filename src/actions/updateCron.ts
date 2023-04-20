import { ViewSubmitAction } from '@slack/bolt';

import { settingsView } from './listOverflow/openSettings';

import { getInputs, getIntervals } from '.';

import { handleSchedule } from '@/bootstrap/schedule';
import { MESSAGE_INPUT_ACTION, UPDATE_CRON } from '@/constants';
import { SELECT_AT_LEAST_ONE_WEEKDAY, SETTINGS_TEXT } from '@/i18n';
import { buildCronId, scheduleMultiple, stopCron } from '@/services/cron';
import { createLogger } from '@/services/logger';
import { repository } from '@/services/repository';
import { app } from '@/services/slack';

const logger = createLogger();

app.view<ViewSubmitAction>({ type: 'view_submission', callback_id: UPDATE_CRON }, async ({ ack, body }) => {
  const team = body.view.team_id;
  const metadata = JSON.parse(body.view.private_metadata);
  const cronId = metadata.c;

  const cron = await repository.fetchCronById(cronId);

  if (!cron) throw new Error(`The cron ${cronId} was not found`);

  const inputs = getInputs(body);

  const areAllInputsEmpty = inputs.every((input) => !input.value);
  if (areAllInputsEmpty) {
    await ack({ response_action: 'errors', errors: { repeat_daily_monday: SELECT_AT_LEAST_ONE_WEEKDAY } });
    return;
  }

  const intervals = getIntervals(inputs);

  const message = body.view.state.values.message[MESSAGE_INPUT_ACTION].value as string;

  cron.intervals.forEach((interval) => {
    stopCron(buildCronId(cron.id, interval));
  });

  const updatedCron = await repository.updateCron({
    ...cron,
    team,
    intervals,
    name: body.view.state.values.name.name_input.value as string,
    users: body.view.state.values.participants.participants_select.selected_users ?? [],
    author: body.user.id,
    message,
  });

  scheduleMultiple([updatedCron], (cron) => {
    logger.debug({ hint: 'cron is running', cron });

    void handleSchedule(cron.id);
  });

  logger.debug({ hint: 'cron is scheduled', updatedCron });

  const view = settingsView(updatedCron);
  await app.client.chat.postEphemeral({
    channel: updatedCron.channel,
    blocks: view.blocks,
    user: body.user.id,
    text: SETTINGS_TEXT.replace('{cronName}', cron.name),
  });
  await ack();
});
