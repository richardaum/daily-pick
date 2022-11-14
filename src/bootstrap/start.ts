import '@/routes';
import { Server } from 'http';

import { schedule } from './schedule';

import { env } from '@/services/env';
import { postRouterSetup } from '@/services/error-tracking';
import { api } from '@/services/express';
import { getPort } from '@/services/get-port';
import { createLogger } from '@/services/logger';
import { connect } from '@/services/repository';

type Api = {
  readonly server: Server;
  readonly port: number;
};

const logger = createLogger();

export const startServer = async () => {
  await connect();
  await schedule();

  const port = await getPort({ port: Number(env('PORT')) });

  return new Promise<Api>((resolve) => {
    const handle = async () => {
      logger.info(`Listening at http://localhost:${port}/api`);
      resolve({ server, port });
    };

    api.use((req, res, next) => {
      logger.info({ method: req.method, url: req.url, statusCode: res.statusCode });
      next();
    });

    postRouterSetup(api);

    const server = api.listen(port, handle).on('error', logger.error);
  });
};
