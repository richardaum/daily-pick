import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { Express } from 'express';

import { env } from '../env';

export const setupSentry = (app: Express) => {
  if (!env('SENTRY_DSN')) return;

  Sentry.init({
    dsn: env('SENTRY_DSN'),
    tracesSampleRate: 1.0,
    integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  app.use(Sentry.Handlers.errorHandler());
};
