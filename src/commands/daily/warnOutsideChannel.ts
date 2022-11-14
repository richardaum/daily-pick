import { RespondFn, SlashCommand } from '@slack/bolt';
import { Blocks, Elements, Surfaces } from 'slack-block-builder';

import { DELETE_MESSAGE_ACTION } from '@/constants';
import { DELETE_MESSAGE, OUTSIDE_CHANNEL_MESSAGE } from '@/i18n';

export function isOutsideChannel(body: SlashCommand) {
  return body.channel_name === 'directmessage' || body.channel_name.startsWith('mpdm');
}

export async function warnOutsideChannel(respond: RespondFn) {
  await respond(
    Surfaces.Message()
      .blocks(
        Blocks.Section({ text: OUTSIDE_CHANNEL_MESSAGE }),
        Blocks.Actions().elements(Elements.Button({ text: DELETE_MESSAGE, actionId: DELETE_MESSAGE_ACTION }))
      )
      .buildToObject()
  );
}
