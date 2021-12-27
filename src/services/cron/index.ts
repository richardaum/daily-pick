import { CronJob } from 'cron';

type Cron = {
  interval: string;
};

export const scheduleSingle = (cronTime: string, onTick: () => void) => {
  new CronJob(cronTime, onTick, null, true, 'America/Sao_Paulo');
};

export const scheduleMultiple = <T extends Cron>(intervals: T[], onTick: (cron: T) => void) => {
  intervals.forEach((cron) => {
    scheduleSingle(cron.interval, () => onTick(cron));
  });
};
