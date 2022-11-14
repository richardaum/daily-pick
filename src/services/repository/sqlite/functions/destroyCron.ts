import { database } from '@/services/repository/sqlite';
import { Repository } from '@/types';
import { Cron, SQLiteCron } from '@/types';

export const destroyCron: Repository['destroyCron'] = async (cronId: string) => {
  const cron = await database().get<SQLiteCron>(
    `
      SELECT * FROM cron
      WHERE id = :id
    `,
    { ':id': cronId }
  );

  if (!cron) return;

  await database().run(
    `
      DELETE FROM cron 
      WHERE id = :id
    `,
    { ':id': cronId }
  );

  return {
    ...cron,
    users: JSON.parse(cron.users) as Cron['users'],
    team: cron.team,
    intervals: JSON.parse(cron.intervals) as Cron['intervals'],
    createdAt: cron.createTime,
  } as Cron;
};
