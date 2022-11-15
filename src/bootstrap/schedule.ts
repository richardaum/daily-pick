import { VError } from 'verror';

import { scheduleMultiple } from '@/services/cron';
import { createLogger } from '@/services/logger';
import { repository } from '@/services/repository';
import { buildQueueIterator } from '@/services/repository/common/buildQueueIterator';
import { getName } from '@/services/slack/functions/getName';
import { postMessage } from '@/services/slack/functions/postMessage';
import { Cron } from '@/types';

const logger = createLogger();

export const schedule = async () => {
  const crons = await repository.fetchCrons();

  crons.forEach((cron) => {
    logger.trace(`Scheduled cron: ${cron.id}`);
  });

  scheduleMultiple(crons, handleSchedule);
};

export const handleSchedule = async (cron: Omit<Cron, 'createdAt'>) => {
  const users = await repository.getUsers(cron.id);
  const it = buildQueueIterator(users, cron.current);
  const mentionCurrent = `<@${it.get()}>`;
  const [nextName] = await getName([it.next().get()]);

  try {
    await postMessage({ cron, current: mentionCurrent, next: nextName });
  } catch (e) {
    const error = e as Error;
    throw new VError(error, `Failed to post message on ${cron.channel} for cron ${cron.id} (${cron.name})`);
  }

  await repository.updateCurrentUser(cron.id, it.next().get());
};
