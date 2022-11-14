import { buildCronFromFirebase } from '@/services/cron';
import { database } from '@/services/repository/firebase';
import { Repository } from '@/types';

export const destroyCron: Repository['destroyCron'] = async (cronId) => {
  const cronSnapshot = await database().collection('crons').doc(cronId).get();
  const cron = buildCronFromFirebase(cronSnapshot);
  await database().collection('crons').doc(cronId).delete();
  return cron;
};
