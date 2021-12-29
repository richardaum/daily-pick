import { scheduleMultiple } from '@/services/cron';
import { fetchCrons } from '@/services/database/functions/fetchCrons';
import { getUsers } from '@/services/database/functions/getUsers';
import { updateCurrentUser } from '@/services/database/functions/updateCurrentUser';
import { getName } from '@/services/slack/functions/getName';
import { postMessage } from '@/services/slack/functions/postMessage';
import { PersistedCron } from '@/types';

export const schedule = async () => {
  const crons = await fetchCrons();
  scheduleMultiple(crons, handleSchedule);
};

export const handleSchedule = async (cron: PersistedCron) => {
  const { current, next } = await getUsers(cron.id);
  const mentionCurrent = `<@${current}>`;
  const [nextName] = await getName([next]);
  await postMessage({ channel: cron.channel, current: mentionCurrent, next: nextName });
  await updateCurrentUser(cron.id, next);
};
