import { slack } from '..';

import { ITS_YOU_TOMORROW, ITS_YOUR_TURN } from '@/i18n';

type PostMessageNamedParams = { channel: string; current: string; next: string };

export const postMessage = async ({ channel, current, next }: PostMessageNamedParams) => {
  return await slack.client.chat.postMessage({
    channel: channel,
    text: [
      `:tada: ${current}, ${ITS_YOUR_TURN} :calendar:`,
      `:black_right_pointing_double_triangle_with_vertical_bar: ${ITS_YOU_TOMORROW}, ${next}. :tada:`,
    ].join('\n'),
  });
};
