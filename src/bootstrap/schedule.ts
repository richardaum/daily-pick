import { scheduleMultiple } from '@/services/cron';
import { fetchCrons, getUsers, updateCurrentUser } from '@/services/database/crons';
import { getName, postMessage } from '@/services/slack';
import { Cron } from '@/types';

export const schedule = async () => {
  const crons = await fetchCrons();
  scheduleMultiple(crons, handleSchedule);
};

export const handleSchedule = async (cron: Cron) => {
  const { current, next } = await getUsers(cron.id);
  const mentionCurrent = `<@${current}>`;
  const [nextName] = await getName([next]);
  await postMessage({ channel: cron.channel, current: mentionCurrent, next: nextName });
  await updateCurrentUser(cron.id, next);
};
