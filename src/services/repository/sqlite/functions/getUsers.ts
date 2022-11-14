import { Queue } from '@/models/queue';
import { database } from '@/services/repository/sqlite';
import { Repository, SQLiteCron } from '@/types';
import { Cron } from '@/types';

export const getUsers: Repository['getUsers'] = async (cronId: string) => {
  let currentUserId;

  const cron = await database().get<SQLiteCron>(
    `
    SELECT * FROM cron
    WHERE id = :id
  `,
    { ':id': cronId }
  );

  if (!cron) throw new Error(`The cron ${cronId} does not exist`);

  const users = JSON.parse(cron.users) as Cron['users'];
  const order = new Queue(users);
  currentUserId = cron?.current;

  if (!currentUserId) {
    currentUserId = order.getByIndex(0).get();
  }

  const nextUserId = order.getByValue(currentUserId).next().get();

  return {
    current: currentUserId,
    next: nextUserId,
  };
};
