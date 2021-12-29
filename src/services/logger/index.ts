import { LoggingBunyan } from '@google-cloud/logging-bunyan';
import bunyan from 'bunyan';

import { env } from '@/services/env';

export function createLogger() {
  const logger = bunyan.createLogger({
    name: 'daily-pick',
    src: true,
    streams: [
      { stream: process.stdout, level: 'info' },
      ...(env('GOOGLE_CLOUD_LOGGING_BUNYAN_ENABLED') === 'true' ? [new LoggingBunyan().stream('info')] : []),
    ],
  });

  if (env('LOG_DISABLED') === 'true') {
    logger.level(bunyan.FATAL + 1);
  }

  return logger;
}
