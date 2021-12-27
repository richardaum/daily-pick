import { database } from './index';

import { Cron } from '@/types';

export const importCrons = async () => {
  const teams = await database.collection('teams').listDocuments();

  const nestedCronsByChannelsByTeams = await Promise.all(
    teams.map(async (team) => {
      const channels = await team.collection('channels').listDocuments();
      return await Promise.all(
        channels.map(async (channel) => {
          const doc = await channel.get();
          return { channel: doc.id, ...doc.data() } as Cron;
        })
      );
    })
  );

  return nestedCronsByChannelsByTeams.flat().flat();
};
