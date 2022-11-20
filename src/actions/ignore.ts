import { BlockButtonAction } from '@slack/bolt';

import { IGNORE_ACTION } from '@/constants';
import { repository } from '@/services/repository';
import { buildQueueIterator } from '@/services/repository/common/buildQueueIterator';
import { app } from '@/services/slack';
import { deleteMessage } from '@/services/slack/functions/deleteMessage';

app.action<BlockButtonAction>(IGNORE_ACTION, async ({ ack, action, body }) => {
  await ack();

  const { c: cronId, l: lastMessage, u: userId } = JSON.parse(action.value) as { c: string; l: string; u: string };
  const cron = await repository.fetchCronById(cronId);
  if (!cron) throw new Error(`The cron ${cronId} was not found`);

  if (cron.lastMessage == null || lastMessage === cron.lastMessage) {
    const it = buildQueueIterator(cron.users, userId);
    await repository.updateCurrentUser(cron.id, it.previous().get());
  }

  await deleteMessage(body.response_url);
});
