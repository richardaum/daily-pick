import schedule from 'node-schedule';

import { PersistedCron } from '@/types';

export const scheduleSingle = (cronId: string, cronTime: string, onTick: () => void) => {
  schedule.scheduleJob(cronId, cronTime, onTick);
};

export const scheduleMultiple = <T extends PersistedCron>(crons: T[], onTick: (cron: T) => void) => {
  crons.forEach((cron) => {
    cron.intervals.forEach((interval) => {
      scheduleSingle(buildCronId(cron.id, interval), interval, () => onTick(cron));
    });
  });
};

export const stopCron = (cronId: string) => {
  return schedule.cancelJob(cronId);
};

export const buildCronId = (cronId: string, interval: string) => {
  return `${cronId}_${interval}`;
};
