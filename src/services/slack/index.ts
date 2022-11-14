import { App, LogLevel } from '@slack/bolt';

import { env } from '@/services/env';

export const slack = new App({
  appToken: env('SLACK_APP_TOKEN'),
  token: env('SLACK_BOT_TOKEN'),
  signingSecret: env('SLACK_SIGNING_SECRET'),
  logLevel: LogLevel.DEBUG,
  port: Number(env('PORT')),
});
