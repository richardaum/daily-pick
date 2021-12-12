import '@daily-pick/routes';
import '@daily-pick/cron';

import { PORT } from './constants';
import { api } from '@daily-pick/express';
import { getPort } from '@daily-pick/get-port';
import { Server } from 'http';

type Api = {
  server: Server;
  port: number;
};

export const startServer = async () => {
  const port = await getPort({ port: PORT });

  return new Promise<Api>((resolve) => {
    const handle = async () => {
      console.log(`Listening at http://localhost:${port}/api`);
      resolve({ server, port });
    };

    const server = api.listen(port, handle).on('error', console.error);
  });
};
