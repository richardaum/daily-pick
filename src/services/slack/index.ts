import { App, LogLevel } from '@slack/bolt';

import { env } from '@/services/env';

export const app = new App({
  appToken: env('SLACK_APP_TOKEN'),
  token: env('SLACK_BOT_TOKEN'),
  signingSecret: env('SLACK_SIGNING_SECRET'),
  logLevel: env('LOG_LEVEL') === 'debug' ? LogLevel.DEBUG : LogLevel.INFO,
  port: Number(env('PORT')),
});
