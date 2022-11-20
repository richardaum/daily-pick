import { Blocks, Elements, Surfaces } from 'slack-block-builder';
import VError from 'verror';

import { BACK_ACTION, IGNORE_ACTION, SKIP_ACTION } from '@/constants';
import { BACK, IGNORE, SKIP } from '@/i18n';
import { buildQueueIterator } from '@/services/repository/common/buildQueueIterator';
import { app } from '@/services/slack';
import { applyVariables, getMessage } from '@/services/slack/functions/getMessage';
import { getName } from '@/services/slack/functions/getName';
import { PostMessageNamedParams } from '@/types';

export const postMessage = async (params: PostMessageNamedParams) => {
  const { cron } = params;

  const it = buildQueueIterator(cron.users, cron.current);
  const [next, previous] = await getName([it.next().get(), it.previous().get()]);
  const current = `<@${it.get()}>`;

  const text = applyVariables(getMessage(cron.message), { current, next });

  try {
    return await app.client.chat.postMessage({
      channel: cron.channel,
      text,
      blocks: Surfaces.Message()
        .blocks(
          Blocks.Section({ text }),
          Blocks.Actions().elements(
            Elements.Button({
              text: IGNORE,
              actionId: IGNORE_ACTION,
              value: JSON.stringify({ c: cron.id, u: it.get(), l: cron.lastMessage }),
            }),
            Elements.Button({
              text: BACK.replace('{previous}', previous),
              actionId: BACK_ACTION,
              value: JSON.stringify({ c: cron.id, u: it.previous().get() }),
            }),
            Elements.Button({
              text: SKIP.replace('{next}', next),
              actionId: SKIP_ACTION,
              value: JSON.stringify({ c: cron.id, u: it.next().get() }),
            })
          )
        )
        .buildToObject().blocks,
    });
  } catch (e) {
    const error = e as Error;
    throw new VError(error, `Failed to post message on ${cron.channel} for cron ${cron.id} (${cron.name})`);
  }
};
