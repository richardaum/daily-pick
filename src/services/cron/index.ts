import { CronJob } from 'cron';

type Cron = {
  interval: string;
};

export const scheduleSingle = (cronTime: string, onTick: () => void) => {
  new CronJob(cronTime, onTick, null, true, 'America/Sao_Paulo');
};

export const scheduleMultiple = async <T extends Cron>(intervals: T[], onTick: (cron: T) => void) =>
  await Promise.all(
    intervals.map((cron) => {
      scheduleSingle(cron.interval, () => onTick(cron));
    })
  );
