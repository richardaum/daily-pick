import axios from 'axios';

import { slack } from '..';

import { ITS_YOU_TOMORROW, ITS_YOUR_TURN } from '@/i18n';

type PostMessageNamedParams = { channel: string; responseUrl?: string; current: string; next: string };

export const postMessage = async ({ channel, responseUrl, current, next }: PostMessageNamedParams) => {
  if (responseUrl) {
    return await axios.post(responseUrl, {
      response_type: 'in_channel',
      text: [
        `:tada: ${current}, ${ITS_YOUR_TURN} :calendar:`,
        `:black_right_pointing_double_triangle_with_vertical_bar: ${ITS_YOU_TOMORROW}, ${next}. :tada:`,
      ].join('\n'),
    });
  } else if (channel) {
    return await slack.client.chat.postMessage({
      channel: channel,
      text: [
        `:tada: ${current}, ${ITS_YOUR_TURN} :calendar:`,
        `:black_right_pointing_double_triangle_with_vertical_bar: ${ITS_YOU_TOMORROW}, ${next}. :tada:`,
      ].join('\n'),
    });
  }

  throw new Error('Channel and responseUrl are not defined');
};
