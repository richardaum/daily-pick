import '@/services/database';
import '@/routes';
import '@/services/cron';

import { Server } from 'http';

import { schedule } from './schedule';

import { env } from '@/services/env';
import { api } from '@/services/express';
import { getPort } from '@/services/get-port';

type Api = {
  readonly server: Server;
  readonly port: number;
};

export const startServer = async () => {
  await schedule();

  const port = await getPort({ port: Number(env('PORT')) });

  return new Promise<Api>((resolve) => {
    const handle = async () => {
      console.log(`Listening at http://localhost:${port}/api`);
      resolve({ server, port });
    };

    const server = api.listen(port, handle).on('error', console.error);
  });
};
