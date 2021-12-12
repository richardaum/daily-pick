import { CronJob } from 'cron';

const jobs = [{ cronTime: '10 * * * * *' }];

jobs.forEach((job) =>
  new CronJob(
    job.cronTime,
    function () {
      console.log('You will see this message every second');
    },
    null,
    true,
    'America/Los_Angeles'
  ).start()
);

export const schedule = (cronTime: string, onTick: () => void) => {
  new CronJob(cronTime, onTick, null, true, 'America/Sao_Paulo');
};
