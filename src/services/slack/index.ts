import { App, LogLevel } from '@slack/bolt';

import { env } from '@/services/env';
import { DEBUG, getLogLevel } from '@/services/logger';

export const app = new App({
  appToken: env('SLACK_APP_TOKEN'),
  token: env('SLACK_BOT_TOKEN'),
  signingSecret: env('SLACK_SIGNING_SECRET'),
  logLevel: getLogLevel() >= DEBUG ? LogLevel.DEBUG : LogLevel.INFO,
  socketMode: true,
});
