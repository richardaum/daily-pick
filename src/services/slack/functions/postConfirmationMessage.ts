import { AckFn, ViewResponseAction, ViewSubmitAction } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { Blocks, Elements, Surfaces } from 'slack-block-builder';
import { VError } from 'verror';

import { DELETE_MESSAGE_ACTION } from '@/constants';
import { DELETE_MESSAGE, INCLUDE_BOT_MESSAGE, WAS_CREATED, YOUR_CRON } from '@/i18n';
import { Cron } from '@/types';

export const postConfirmationMessage = async ({
  client,
  channel,
  body,
  cron,
  ack,
}: {
  ack: AckFn<ViewResponseAction>;
  channel: string;
  body: ViewSubmitAction;
  cron: Omit<Cron, 'createdAt'>;
  client: WebClient;
}) => {
  try {
    const text = `${YOUR_CRON} "${cron.name}" ${WAS_CREATED}`;
    await client.chat.postEphemeral({
      channel,
      user: body.user.id,
      text,
      blocks: Surfaces.Message()
        .blocks(
          Blocks.Section({ text }),
          Blocks.Actions().elements(Elements.Button({ text: DELETE_MESSAGE, actionId: DELETE_MESSAGE_ACTION }))
        )
        .buildToObject().blocks,
    });
  } catch (e) {
    const error = e as Error;

    if (error?.message?.includes('channel_not_found')) {
      await ack({
        response_action: 'errors',
        errors: { name: INCLUDE_BOT_MESSAGE },
      });
    }

    const metadata = { channel, user: cron.author, name: cron.name };
    throw new VError(error, `postConfirmationMessage - ${JSON.stringify(metadata)}`);
  }
};
