import { BlockButtonAction } from '@slack/bolt';
import { Blocks, Elements, Surfaces } from 'slack-block-builder';

import {
  ADD_PARTICIPANT_ACTION,
  ADD_PARTICIPANT_INPUT_ACTION,
  ADD_PARTICIPANT_MODAL_CALLBACK_ID,
  PARTICIPANT_BLOCK_ID,
} from '@/constants';
import {
  ADD_PARTICIPANT_INPUT_PLACEHOLDER,
  ADD_PARTICIPANT_MODAL_TITLE,
  CLOSE_BUTTON,
  PARTICIPANT_INPUT_LABEL,
  SUBMIT_BUTTON,
} from '@/i18n';
import { app } from '@/services/slack';

app.action<BlockButtonAction>(ADD_PARTICIPANT_ACTION, async ({ ack, client, body, action }) => {
  const { c: cronId } = JSON.parse(action.value);

  await client.views.open({
    trigger_id: body.trigger_id,
    view: Surfaces.Modal({
      callbackId: ADD_PARTICIPANT_MODAL_CALLBACK_ID,
      title: ADD_PARTICIPANT_MODAL_TITLE,
      submit: SUBMIT_BUTTON,
      close: CLOSE_BUTTON,
      privateMetaData: JSON.stringify({ c: cronId, r: body.response_url, ch: body.channel?.id }),
    })
      .blocks(
        Blocks.Input({ label: PARTICIPANT_INPUT_LABEL, blockId: PARTICIPANT_BLOCK_ID }).element(
          Elements.UserSelect({
            actionId: ADD_PARTICIPANT_INPUT_ACTION,
            placeholder: ADD_PARTICIPANT_INPUT_PLACEHOLDER,
          })
        )
      )
      .buildToObject(),
  });
  await ack();
});
