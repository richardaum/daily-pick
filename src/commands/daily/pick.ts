import { RespondFn, SlashCommand } from '@slack/bolt';
import { Blocks, Elements, Surfaces } from 'slack-block-builder';

import { DELETE_MESSAGE_ACTION, OPEN_MODAL_ACTION } from '@/constants';
import { ADD_BOT_INTEGRATION_MESSAGE, ALREADY_ADDED_BOT_INTEGRATION, CANCELD_ADDING_BOT_INTEGRATION } from '@/i18n';

export function isPicking(body: SlashCommand) {
  return Boolean(body.trigger_id) && body.text === 'pick';
}

export async function pick({ respond }: { respond: RespondFn }) {
  await respond(
    Surfaces.Message()
      .blocks(
        Blocks.Section({ text: ADD_BOT_INTEGRATION_MESSAGE }),
        Blocks.Actions().elements([
          Elements.Button({ text: ALREADY_ADDED_BOT_INTEGRATION, actionId: OPEN_MODAL_ACTION }),
          Elements.Button({ text: CANCELD_ADDING_BOT_INTEGRATION, actionId: DELETE_MESSAGE_ACTION }),
        ])
      )
      .buildToObject()
  );
}
