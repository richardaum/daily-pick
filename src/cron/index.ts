import { CronJob } from 'cron';

import { Cron } from '@/types';

export const scheduleSingle = (cronTime: string, onTick: () => void) => {
  new CronJob(cronTime, onTick, null, true, 'America/Sao_Paulo');
};

export const scheduleMultiple = async (
  intervals: Cron[],
  onTick: (cron: Cron) => void
) =>
  await Promise.all(
    intervals.map((cron) => {
      scheduleSingle(cron.interval, () => onTick(cron));
    })
  );
