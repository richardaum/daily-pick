import { buildCreatedAt } from '@/services/repository/common';
import { database } from '@/services/repository/firebase';
import { FirebaseCronSnapshot, Repository } from '@/types';

export const fetchCronById: Repository['fetchCronById'] = async (cronId: string) => {
  const cron = await database().collection('crons').doc(cronId).get();
  return {
    ...(cron.data() as FirebaseCronSnapshot),
    createdAt: buildCreatedAt(cron.createTime?.toDate()),
    id: cron.id,
    type: 'firebase',
  };
};
