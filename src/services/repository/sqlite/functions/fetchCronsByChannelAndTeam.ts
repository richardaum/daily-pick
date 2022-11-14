import { database } from '@/services/repository/sqlite';
import { Repository, SQLiteCron } from '@/types';
import { Cron, FirebaseCron } from '@/types';

export const fetchCronsByChannelAndTeam: Repository['fetchCronsByChannelAndTeam'] = async (channel, team) => {
  const crons = await database().all<SQLiteCron[]>(
    ` 
      SELECT * FROM cron
      WHERE channel = :channel AND team = :team
    `,
    { ':channel': channel, ':team': team }
  );

  return crons.reduce((crons, cron) => {
    const { responseUrl, channel } = cron;

    const persistedCron: Cron = {
      ...cron,
      users: JSON.parse(cron.users) as FirebaseCron['users'],
      team: cron.team,
      intervals: JSON.parse(cron.intervals) as FirebaseCron['intervals'],
      createdAt: cron.createTime,
      responseUrl: responseUrl,
      channel: channel,
    };

    crons.push(persistedCron);
    return crons;
  }, [] as Cron[]);
};
