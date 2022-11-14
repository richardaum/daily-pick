import { v4 } from 'uuid';

import { database } from '@/services/repository/sqlite';
import { Repository, SQLiteCron } from '@/types';

export const persistCron: Repository['persistCron'] = async (cron) => {
  const persistedCron: SQLiteCron = {
    ...cron,
    id: v4(),
    current: cron.users[0],
    intervals: JSON.stringify(cron.intervals),
    users: JSON.stringify(cron.users),
    createTime: new Date().toISOString(),
  };

  await database().run(
    `
      INSERT INTO cron 
      (id, channel, current, intervals, name, team, users, createTime, author, message) VALUES
      (:id, :channel, :current, :intervals, :name, :team, :users, :createTime, :author, :message)
    `,
    Object.entries(persistedCron).reduce((prefixed, [key, value]) => ({ ...prefixed, [`:${key}`]: value }), {})
  );

  return { ...cron, id: persistedCron.id, current: persistedCron.current };
};
