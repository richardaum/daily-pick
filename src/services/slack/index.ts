import { App, LogLevel } from '@slack/bolt';

export const slack = new App({
  appToken: process.env.SLACK_APP_TOKEN,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG,
  socketMode: true,
});

type PostMessageNamedParams = { channel: string; current: string; next: string };

export const postMessage = async ({ channel, current, next }: PostMessageNamedParams) => {
  return await slack.client.chat.postMessage({
    channel: channel,
    text: [
      `:tada: ${current}, é sua vez na daily de hoje! :calendar:`,
      `:black_right_pointing_double_triangle_with_vertical_bar: Amanhã é você, ${next}. :tada:`,
    ].join('\n'),
  });
};
