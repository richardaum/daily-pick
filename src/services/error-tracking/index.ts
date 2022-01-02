import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { Express, NextFunction, Request, Response } from 'express';

import { env } from '../env';

import { createLogger } from '@/services/logger';

const logger = createLogger();

export const setupSentry = (app: Express) => {
  if (!env('SENTRY_DSN')) return;

  Sentry.init({
    dsn: env('SENTRY_DSN'),
    tracesSampleRate: 1.0,
    environment: env('NODE_ENV') ?? 'unknown',
    integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
};

export const postRouterSetup = (app: Express) => {
  app.use(Sentry.Handlers.errorHandler());
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (!error) return next();

    res.status(500).end(error.stack);
    logger.error({ method: req.method, url: req.url, statusCode: res.statusCode });
    logger.error(error);
  });
};
