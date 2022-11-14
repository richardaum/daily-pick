import { Blocks, Elements, Surfaces } from 'slack-block-builder';

import { slack } from '..';

import { SKIP_ACTION } from '@/constants';
import { ITS_YOUR_TURN, NEXT_TIME, SKIP } from '@/i18n';

type PostMessageNamedParams = { cronId: string; channel: string; current: string; next: string };

export const postMessage = async ({ cronId, channel, current, next }: PostMessageNamedParams) => {
  return await slack.client.chat.postMessage({
    channel: channel,

    blocks: Surfaces.Message({
      text: `:tada: ${current}, ${ITS_YOUR_TURN} :calendar:`,
    })
      .blocks(
        Blocks.Section({
          text: [
            `:tada: ${current}, ${ITS_YOUR_TURN} :calendar:`,
            `:black_right_pointing_double_triangle_with_vertical_bar: ${NEXT_TIME}, ${next}. :tada:`,
          ].join('\n'),
        }),
        Blocks.Actions().elements(Elements.Button({ text: SKIP, actionId: SKIP_ACTION, value: cronId }))
      )
      .buildToObject().blocks,
  });
};
