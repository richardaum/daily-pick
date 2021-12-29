import bunyan from 'bunyan';

import { env } from '@/services/env';

export function createLogger() {
  const logger = bunyan.createLogger({
    name: 'daily-pick',
    src: true,
    streams: [{ stream: process.stdout, level: 'info' }],
  });

  if (env('LOG_DISABLED') === 'true') {
    logger.level(bunyan.FATAL + 1);
  }

  return logger;
}
