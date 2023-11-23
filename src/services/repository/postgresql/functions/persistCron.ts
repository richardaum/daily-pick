import { v4 } from 'uuid';

import { database } from '@/services/repository/postgresql';
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

  await database().query(
    `
      INSERT INTO cron
      (id, channel, current, intervals, name, team, users, createTime, author, message) VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `,
    [
      persistedCron.id,
      persistedCron.channel,
      persistedCron.current,
      persistedCron.intervals,
      persistedCron.name,
      persistedCron.team,
      persistedCron.users,
      persistedCron.createTime,
      persistedCron.author,
      persistedCron.message,
    ]
  );

  return { ...cron, id: persistedCron.id, current: persistedCron.current };
};
