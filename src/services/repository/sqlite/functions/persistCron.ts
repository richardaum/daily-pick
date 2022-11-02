import { v4 } from 'uuid';

import { database } from '@/services/repository/sqlite';
import { Repository, SQLiteCron } from '@/types';

export const persistCron: Repository['persistCron'] = async (cron) => {
  const { users, team, channel, intervals, name, responseUrl } = cron;

  const persistedCron: SQLiteCron = {
    id: v4(),
    channel: channel,
    responseUrl: responseUrl,
    current: users[0],
    intervals: JSON.stringify(intervals),
    name: name,
    team: team,
    users: JSON.stringify(users),
    createTime: new Date().toISOString(),
  };

  await database().run(
    `
      INSERT INTO cron 
      (id, channel, current, intervals, name, team, users, createTime, responseUrl) VALUES
      (:id, :channel, :current, :intervals, :name, :team, :users, :createTime, :responseUrl)
    `,
    Object.entries(persistedCron).reduce(
      (prefixed, [key, value]) => ({
        ...prefixed,
        [`:${key}`]: value,
      }),
      {}
    )
  );

  return { ...cron, id: persistedCron.id, current: persistedCron.current };
};
