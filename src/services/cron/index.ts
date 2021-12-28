import cronParser from 'cron-parser';
import { cancelJob, RecurrenceRule, scheduleJob } from 'node-schedule';

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
  const raw = cronParser.parseExpression(interval, { tz: TIMEZONE });
  const fields = JSON.parse(JSON.stringify(raw.fields)) as CronFields;
  const rule = new RecurrenceRule();
  rule.second = fields.second;
  rule.minute = fields.minute;
  rule.hour = fields.hour;
  rule.date = fields.dayOfMonth;
  rule.month = fields.month;
  rule.dayOfWeek = fields.dayOfWeek;
  rule.tz = TIMEZONE;
  scheduleJob(cronId, rule, onTick);
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
