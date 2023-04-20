import { BlockButtonAction } from '@slack/bolt';
import axios from 'axios';

import { settingsView } from '@/actions/listOverflow/openSettings';
import { REMOVE_PARTICIPANT_ACTION } from '@/constants';
import { repository } from '@/services/repository';
import { app } from '@/services/slack';

app.action<BlockButtonAction>(REMOVE_PARTICIPANT_ACTION, async ({ ack, action, body }) => {
  const { u: user, c: cronId } = JSON.parse(action.value) as { u: string; c: string };
  const cron = await repository.fetchCronById(cronId);
  if (!cron) throw new Error(`The cron ${cronId} was not found`);

  const updatedCron = {
    ...cron,
    users: cron.users.filter((u) => user !== u),
  };

  await repository.updateCron(updatedCron);
  await axios.post(body.response_url, settingsView(updatedCron));
  await ack();
});
