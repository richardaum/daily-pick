import { scheduleMultiple } from '@/services/cron';
import { importCrons } from '@/services/database/crons';
import { updateCurrentUser } from '@/services/database/update';
import { getCurrentUser } from '@/services/database/users';
import { postMessage } from '@/services/slack';

export const schedule = async () => {
  const intervals = await importCrons();

  scheduleMultiple(intervals, async (cron) => {
    const { current, next } = await getCurrentUser(cron.team, cron.channel);
    await postMessage({ channel: cron.channel, current: current.name, next: next.name });
    await updateCurrentUser(cron.team, cron.channel, next);
  });
};
