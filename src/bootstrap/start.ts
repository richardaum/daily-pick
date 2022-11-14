import '@/actions';
import '@/commands';
import { captureException } from '@sentry/node';

import { schedule } from './schedule';

import { setupErrorTracking } from '@/services/error-tracking';
import { createLogger } from '@/services/logger';
import { connect } from '@/services/repository';
import { slack as app } from '@/services/slack';

const logger = createLogger();

export const startServer = async () => {
  setupErrorTracking();

  await connect();
  await schedule();

  await app.start();

  app.error(async (error) => {
    logger.error(error);
    captureException(error);
  });

  logger.info(`⚡️ Bolt app is running!`);
};
