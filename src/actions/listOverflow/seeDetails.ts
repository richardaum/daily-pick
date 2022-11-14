import { BlockAction, OverflowAction } from '@slack/bolt';

import { buildCronFromSQLite } from '@/services/cron';
import { repository } from '@/services/repository';

export const seeDetails = async ({ body, cronId }: { body: BlockAction<OverflowAction>; cronId: string }) => {
  // asdf
  // const rawCron = await repository.fetchCronById(cronId);
  // if (!rawCron) throw new Error(`The cron ${cronId} was not found`);
  // if (rawCron.type !== 'sqlite') return;
  // const cron = buildCronFromSQLite(rawCron);
  // console.log(cron);
};
