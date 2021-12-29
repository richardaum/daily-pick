import { database } from '..';

import { buildCreatedAt } from './buildCreatedAt';

import { Cron, PersistedCron } from '@/types';

export const fetchCronsByChannelAndTeam = async (channel: string, team: string) => {
  const cronsRef = await database.collection('crons').where('channel', '==', channel).where('team', '==', team).get();
  const crons = cronsRef.docs.map((cronSnapshot) => {
    const cron = cronSnapshot.data() as Cron;
    return {
      ...cron,
      createdAt: buildCreatedAt(cronSnapshot.createTime?.toDate()),
      id: cronSnapshot.id,
    } as PersistedCron;
  });
  return crons;
};
