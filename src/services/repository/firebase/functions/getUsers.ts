import { database } from '@/services/repository/firebase';
import { Cron, Repository } from '@/types';

export const getUsers: Repository['getUsers'] = async (cronId) => {
  const cronRef = database().collection('crons').doc(cronId);
  const cronSnapshot = await cronRef.get();
  const cron = cronSnapshot.data() as Cron;
  return cron.users;
};
