import { VError } from 'verror';

import { scheduleMultiple } from '@/services/cron';
import { createLogger } from '@/services/logger';
import { repository } from '@/services/repository';
import { buildQueueIterator } from '@/services/repository/common/buildQueueIterator';
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
  name: string;
  channel: string;
  current?: string;
};

export const handleSchedule = async (cron: PartialCron) => {
  const users = await repository.getUsers(cron.id);
  const it = buildQueueIterator(users, cron.current);
  const mentionCurrent = `<@${it.get()}>`;
  const [nextName] = await getName([it.next().get()]);

  try {
    await postMessage({ cronId: cron.id, channel: cron.channel, current: mentionCurrent, next: nextName });
  } catch (e) {
    const error = e as Error;

    if (error?.message?.includes('channel_not_found') || error?.message?.includes('not_in_channel')) {
      throw new VError(error, `Invalid channel ${cron.channel} for cron ${cron.id} (${cron.name})`);
    }

    throw e;
  }

  await repository.updateCurrentUser(cron.id, it.next().get());
};
