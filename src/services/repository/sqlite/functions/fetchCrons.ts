import { database } from '@/services/repository/sqlite';
import { Cron, Repository, SQLiteCron } from '@/types';

export const fetchCrons: Repository['fetchCrons'] = async () => {
  const crons = await database().all<SQLiteCron[]>(`
    SELECT * FROM cron
  `);

  return crons.reduce((crons, cron) => {
    const { responseUrl, channel } = cron;

    const persistedCron: Cron = {
      ...cron,
      users: JSON.parse(cron.users) as Cron['users'],
      team: cron.team,
      intervals: JSON.parse(cron.intervals) as Cron['intervals'],
      createdAt: cron.createTime,
      responseUrl: responseUrl,
      channel: channel,
    };

    crons.push(persistedCron);
    return crons;
  }, [] as Cron[]);
};
