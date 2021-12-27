import '@/database';
import '@/routes';
import '@/cron';

import { Server } from 'http';

import { schedule } from './schedule';

import { PORT } from '@/constants';
import { importUsers } from '@/database/import';
import { api } from '@/express';
import { getPort } from '@/get-port';

type Api = {
  readonly server: Server;
  readonly port: number;
};

export const startServer = async () => {
  await importUsers();
  await schedule();

  const port = await getPort({ port: PORT });

  return new Promise<Api>((resolve) => {
    const handle = async () => {
      console.log(`Listening at http://localhost:${port}/api`);
      resolve({ server, port });
    };

    const server = api.listen(port, handle).on('error', console.error);
  });
};
