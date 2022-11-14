import { cancelJob, scheduleJob } from 'node-schedule';

import { TIMEZONE } from '@/constants';
import { Cron, FirebaseCron, SQLiteCron } from '@/types';

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

type PartialCron = {
  id: string;
  intervals: string[];
};

export const scheduleMultiple = <T extends PartialCron>(crons: T[], onTick: (cron: T) => void) => {
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

export const buildCronFromSQLite = (cron: SQLiteCron): Cron => {
  return {
    ...cron,
    users: JSON.parse(cron.users) as FirebaseCron['users'],
    team: cron.team,
    intervals: JSON.parse(cron.intervals) as FirebaseCron['intervals'],
    createdAt: cron.createTime,
  };
};
