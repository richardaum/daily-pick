import '@sentry/tracing';

import * as Sentry from '@sentry/node';

import { env } from '../env';

export const setupErrorTracking = () => {
  Sentry.init({
    dsn: env('SENTRY_DSN'),
    tracesSampleRate: 1.0,
  });
};
