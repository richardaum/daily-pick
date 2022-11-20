import { BlockButtonAction } from '@slack/bolt';
import { v4 } from 'uuid';

import { BACK_ACTION, SKIP_ACTION } from '@/constants';
import { repository } from '@/services/repository';
import { app } from '@/services/slack';
import { postMessage } from '@/services/slack/functions/postMessage';

app.action<BlockButtonAction>(new RegExp(`${SKIP_ACTION}|${BACK_ACTION}`), async ({ ack, body, action, client }) => {
  await ack();

  const { c: cronId, u: userId } = JSON.parse(action.value);
  const cron = await repository.fetchCronById(cronId);
  if (!cron) throw new Error(`The cron ${cronId} was not found`);

  if (body.message?.ts && body.channel?.id) {
    await client.chat.delete({ ts: body.message.ts, channel: body.channel.id });
  }

  const lastMessage = v4();
  await repository.updateCurrentUser(cron.id, userId);
  await repository.updateLastMessage(cron.id, lastMessage);
  await postMessage({ cron: { ...cron, current: userId, lastMessage } });
});
