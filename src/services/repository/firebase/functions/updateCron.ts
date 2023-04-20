import { database } from '@/services/repository/firebase';
import { Repository } from '@/types';

export const updateCron: Repository['updateCron'] = async (cron) => {
  await database().collection('crons').doc(cron.id).update(cron);
  return cron;
};
