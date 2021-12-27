import { scheduleMultiple } from '@/cron';
import { importCrons } from '@/database/crons';
import { updateCurrentUser } from '@/database/update';
import { getCurrentUser } from '@/database/users';
import { slack } from '@/slack';

export const schedule = async () => {
  const intervals = await importCrons();

  scheduleMultiple(intervals, async (cron) => {
    const { current, next } = await getCurrentUser(cron.team, cron.channel);

    await slack.client.chat.postMessage({
      channel: cron.channel,
      text: `:tada: ${current.name}, it's your time today! :tada:`,
    });

    await updateCurrentUser(cron.team, cron.channel, next);
  });
};
