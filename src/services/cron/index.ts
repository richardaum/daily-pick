import { cancelJob, scheduleJob } from 'node-schedule';

import { TIMEZONE } from '@/constants';
import { PersistedCron } from '@/types';

export type CronFields = {
  second: number[];
  minute: number[];
  hour: number[];
  dayOfMonth: number[];
  month: number[];
  dayOfWeek: number[];
};

export const scheduleSingle = (cronId: string, interval: string, onTick: () => void) => {
  scheduleJob(cronId, { rule: interval, tz: TIMEZONE }, onTick);
};

export const scheduleMultiple = <T extends PersistedCron>(crons: T[], onTick: (cron: T) => void) => {
  crons.forEach((cron) => {
    cron.intervals.forEach((interval) => {
      scheduleSingle(buildCronId(cron.id, interval), interval, () => onTick(cron));
    });
  });
};

export const stopCron = (cronId: string) => {
  return cancelJob(cronId);
};

export const buildCronId = (cronId: string, interval: string) => {
  return `${cronId}_${interval}`;
};
