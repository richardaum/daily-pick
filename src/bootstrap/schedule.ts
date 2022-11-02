import { scheduleMultiple } from '@/services/cron';
import { createLogger } from '@/services/logger';
import { repository } from '@/services/repository';
import { getName } from '@/services/slack/functions/getName';
import { postMessage } from '@/services/slack/functions/postMessage';

const logger = createLogger();

export const schedule = async () => {
  const crons = await repository.fetchCrons();

  crons.forEach((cron) => {
    logger.trace(`Scheduled cron: ${cron.id}`);
  });

  scheduleMultiple(crons, handleSchedule);
};

type PartialCron = {
  id: string;
  channel: string;
  responseUrl?: string;
};

export const handleSchedule = async (cron: PartialCron) => {
  const { current, next } = await repository.getUsers(cron.id);
  const mentionCurrent = `<@${current}>`;
  const [nextName] = await getName([next]);
  await postMessage({ channel: cron.channel, responseUrl: cron.responseUrl, current: mentionCurrent, next: nextName });
  await repository.updateCurrentUser(cron.id, next);
};
