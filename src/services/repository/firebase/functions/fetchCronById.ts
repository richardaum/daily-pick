import { buildCronFromFirebase } from '../../../cron/index';

import { database } from '@/services/repository/firebase';
import { Repository } from '@/types';

export const fetchCronById: Repository['fetchCronById'] = async (cronId: string) => {
  const cron = await database().collection('crons').doc(cronId).get();
  return buildCronFromFirebase(cron);
};
