import { slack } from '..';

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
