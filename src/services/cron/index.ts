import { CronJob } from 'cron';

import { Cron } from '@/types';

export const scheduleSingle = (cronTime: string, onTick: () => void) => {
  new CronJob(cronTime, onTick, null, true, 'America/Sao_Paulo');
};

export const scheduleMultiple = <T extends Cron>(crons: T[], onTick: (cron: T) => void) => {
  crons.forEach((cron) => {
    cron.intervals.forEach((interval) => {
      scheduleSingle(interval, () => onTick(cron));
    });
  });
};
