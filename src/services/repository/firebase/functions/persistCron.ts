import { database } from '@/services/repository/firebase';
import { Repository } from '@/types';

export const persistCron: Repository['persistCron'] = async (cron) => {
  const { users, team, channel, intervals, name, author, message } = cron;
  const crons = database().collection('crons');
  const cronRef = crons.doc();
  await cronRef.set({ team, channel, users, intervals, name, author, message });
  return { ...cron, id: cronRef.id, current: users[0] };
};
