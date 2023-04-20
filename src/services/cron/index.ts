import parser from 'cron-parser';
import { toString } from 'lodash';
import { cancelJob, scheduleJob } from 'node-schedule';

import { daysOfWeek, TIMEZONE } from '@/constants';
import { buildCreatedAt } from '@/services/repository/common';
import { Cron, FirebaseCron, FirebaseCronDocumentData, SQLiteCron, TimePerWeeDay } from '@/types';

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

export const buildCronsFromSQLite = (crons: SQLiteCron[]): Cron[] => {
  return crons.map((cron) => buildCronFromSQLite(cron));
};

export const buildCronFromSQLite = (cron: SQLiteCron): Cron => {
  return {
    ...cron,
    users: JSON.parse(cron.users) as FirebaseCron['users'],
    intervals: JSON.parse(cron.intervals) as FirebaseCron['intervals'],
    createdAt: cron.createTime,
  };
};

export const buildCronToSQLite = (cron: Cron): SQLiteCron => {
  return {
    ...cron,
    users: JSON.stringify(cron.users),
    intervals: JSON.stringify(cron.intervals),
    createTime: cron.createdAt,
  };
};

export const buildCronFromFirebase = (
  snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
): Cron => {
  return {
    ...(snapshot.data() as FirebaseCronDocumentData),
    createdAt: buildCreatedAt(snapshot.createTime?.toDate()),
    id: snapshot.id,
  };
};

export const getTimePerWeekday = (intervals: string[]): TimePerWeeDay => {
  const response: TimePerWeeDay = {};

  intervals.forEach((interval) => {
    const parsed = parser.parseExpression(interval);
    const dayOfWeek = parsed.fields.dayOfWeek[0];

    if (!daysOfWeek[dayOfWeek]) return;

    const dayOfWeekLabel = daysOfWeek[dayOfWeek];
    const hour = toString(parsed.fields.hour).padStart(2, '0');
    const minute = toString(parsed.fields.minute).padStart(2, '0');
    response[dayOfWeekLabel] = `${hour}:${minute}`;
  });

  return response;
};
