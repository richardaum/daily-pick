import { v4 } from 'uuid';

import { database } from '@/services/repository/sqlite';
import { Repository, SQLiteCron } from '@/types';

export const persistCron: Repository['persistCron'] = async (cron) => {
  const persistedCron: SQLiteCron = {
    id: v4(),
    channel: cron.channel,
    current: cron.users[0],
    intervals: JSON.stringify(cron.intervals),
    name: cron.name,
    team: cron.team,
    users: JSON.stringify(cron.users),
    createTime: new Date().toISOString(),
    author: cron.author,
  };

  await database().run(
    `
      INSERT INTO cron 
      (id, channel, current, intervals, name, team, users, createTime, author) VALUES
      (:id, :channel, :current, :intervals, :name, :team, :users, :createTime, :author)
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
