import { Blocks, Elements, Surfaces } from 'slack-block-builder';

import { SKIP_ACTION } from '@/constants';
import { SKIP } from '@/i18n';
import { slack as app } from '@/services/slack';
import { applyVariables, getMessage } from '@/services/slack/functions/getMessage';
import { PostMessageNamedParams } from '@/types';

export const postMessage = async (params: PostMessageNamedParams) => {
  const { cronId, channel, message } = params;
  return await app.client.chat.postMessage({
    channel: channel,

    blocks: Surfaces.Message()
      .blocks(
        Blocks.Section({ text: applyVariables(getMessage(message), params) }),
        Blocks.Actions().elements(Elements.Button({ text: SKIP, actionId: SKIP_ACTION, value: cronId }))
      )
      .buildToObject().blocks,
  });
};
