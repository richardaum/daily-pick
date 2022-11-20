import { v4 } from 'uuid';

import { scheduleMultiple } from '@/services/cron';
import { createLogger } from '@/services/logger';
import { repository } from '@/services/repository';
import { buildQueueIterator } from '@/services/repository/common/buildQueueIterator';
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
  const it = buildQueueIterator(cron.users, cron.current);
  const user = it.next().get();
  const lastMessage = v4();
  await repository.updateCurrentUser(cron.id, user);
  await repository.updateLastMessage(cron.id, lastMessage);
  await postMessage({ cron: { ...cron, current: user, lastMessage } });
};
