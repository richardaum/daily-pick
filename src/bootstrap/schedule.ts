import * as Sentry from '@sentry/node';
import { v4 } from 'uuid';

import { scheduleMultiple } from '@/services/cron';
import { createLogger } from '@/services/logger';
import { repository } from '@/services/repository';
import { buildQueueIterator } from '@/services/repository/common/buildQueueIterator';
import { postMessage } from '@/services/slack/functions/postMessage';
const logger = createLogger();

export const schedule = async () => {
  const crons = await repository.fetchCrons();

  crons.forEach((cron) => {
    logger.trace(`Scheduled cron: ${cron.id}`);
  });

  scheduleMultiple(crons, (cron) => handleSchedule(cron.id));
};

export const handleSchedule = async (cronId: string) => {
  const cron = await repository.fetchCronById(cronId);
  if (!cron) throw new Error(`${cronId} was schedule but it not valid anymore`);

  Sentry.setContext('cron', cron);

  const it = buildQueueIterator(cron.users, cron.current);
  const user = it.next().get();
  const lastMessage = v4();
  await repository.updateCurrentUser(cron.id, user);
  await repository.updateLastMessage(cron.id, lastMessage);
  await postMessage({ cron: { ...cron, current: user, lastMessage } });
};
