import { RespondFn } from '@slack/bolt';
import { Blocks, Elements, Surfaces } from 'slack-block-builder';

import { DELETE_MESSAGE_ACTION } from '@/constants';
import { AVAILABLE_COMMANDS, DELETE_MESSAGE, MORE_INFO, TO_ADD_A_NEW_CRON, TO_LIST_CRONS } from '@/i18n';

export async function help(respond: RespondFn) {
  const view = Surfaces.Message()
    .blocks(
      Blocks.Header({ text: AVAILABLE_COMMANDS }),
      Blocks.Section({ text: [TO_ADD_A_NEW_CRON, '`/daily pick`\n'].join('\n') }),
      Blocks.Section({ text: [TO_LIST_CRONS, '`/daily list`'].join('\n') }),
      Blocks.Section({ text: MORE_INFO }),
      Blocks.Actions().elements(Elements.Button({ text: DELETE_MESSAGE, actionId: DELETE_MESSAGE_ACTION }))
    )
    .buildToObject();

  await respond(view);
}
