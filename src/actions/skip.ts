import { BlockButtonAction } from '@slack/bolt';

import { handleSchedule } from '@/bootstrap/schedule';
import { SKIP_ACTION } from '@/constants';
import { repository } from '@/services/repository';
import { app } from '@/services/slack';

app.action<BlockButtonAction>(SKIP_ACTION, async ({ ack, body, action, client }) => {
  await ack();

  const cronId = action.value;
  const cron = await repository.fetchCronById(cronId);
  if (!cron) throw new Error(`The cron ${cronId} was not found`);

  if (body.message?.ts && body.channel?.id) {
    await client.chat.delete({ ts: body.message.ts, channel: body.channel.id });
  }
  await handleSchedule(cron);
});
