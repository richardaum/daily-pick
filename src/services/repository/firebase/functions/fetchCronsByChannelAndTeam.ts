import { buildCreatedAt } from '@/services/repository/common';
import { database } from '@/services/repository/firebase';
import { Cron, FirebaseCron, Repository } from '@/types';

export const fetchCronsByChannelAndTeam: Repository['fetchCronsByChannelAndTeam'] = async (channel, team) => {
  const cronsRef = await database().collection('crons').where('channel', '==', channel).where('team', '==', team).get();
  const crons = cronsRef.docs.map((cronSnapshot) => {
    const cron = cronSnapshot.data() as FirebaseCron;
    return {
      ...cron,
      createdAt: buildCreatedAt(cronSnapshot.createTime?.toDate()),
      id: cronSnapshot.id,
    } as Cron;
  });
  return crons;
};
