import { buildCronFromFirebase } from '@/services/cron';
import { database } from '@/services/repository/firebase';
import { Repository } from '@/types';

export const fetchCrons: Repository['fetchCrons'] = async () => {
  const cronsRef = await database().collection('crons').listDocuments();
  const crons = await Promise.all(cronsRef.map(async (docRef) => buildCronFromFirebase(await docRef.get())));
  return crons;
};
