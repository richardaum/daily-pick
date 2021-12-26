import { CronJob } from 'cron';

export const schedule = (cronTime: string, onTick: () => void) => {
  new CronJob(cronTime, onTick, null, true, 'America/Sao_Paulo');
};
