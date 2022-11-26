import { BlockAction, OverflowAction, RespondFn } from '@slack/bolt';

import { handleSchedule } from '@/bootstrap/schedule';
import { repository } from '@/services/repository';

export const triggerCron = async ({
  cronId,
}: {
  body: BlockAction<OverflowAction>;
  cronId: string;
  respond: RespondFn;
}) => {
  const cron = await repository.fetchCronById(cronId);
  if (!cron) throw new Error(`The cron ${cronId} was not found`);
  await handleSchedule(cron.id);
};
