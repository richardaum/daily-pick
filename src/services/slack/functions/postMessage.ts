import { Blocks, Elements, Surfaces } from 'slack-block-builder';

import { SKIP_ACTION } from '@/constants';
import { SKIP } from '@/i18n';
import { app } from '@/services/slack';
import { applyVariables, getMessage } from '@/services/slack/functions/getMessage';
import { PostMessageNamedParams } from '@/types';

export const postMessage = async (params: PostMessageNamedParams) => {
  const { cron } = params;
  return await app.client.chat.postMessage({
    channel: cron.channel,

    blocks: Surfaces.Message()
      .blocks(
        Blocks.Section({ text: applyVariables(getMessage(cron.message), params) }),
        Blocks.Actions().elements(Elements.Button({ text: SKIP, actionId: SKIP_ACTION, value: cron.id }))
      )
      .buildToObject().blocks,
  });
};
