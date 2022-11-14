import { buildCronFromFirebase } from '@/services/cron';
import { database } from '@/services/repository/firebase';
import { Repository } from '@/types';

export const fetchCronsByChannelAndTeam: Repository['fetchCronsByChannelAndTeam'] = async (channel, team) => {
  const cronsRef = await database().collection('crons').where('channel', '==', channel).where('team', '==', team).get();
  const crons = cronsRef.docs.map((cronSnapshot) => buildCronFromFirebase(cronSnapshot));
  return crons;
};
