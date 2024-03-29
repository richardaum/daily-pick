import { BlockButtonAction } from '@slack/bolt';
import { Blocks, Elements, Modal } from 'slack-block-builder';

import { CREATE_CRON, MESSAGE_INPUT_ACTION, OPEN_MODAL_ACTION, repeatDailyPrefix, timePickerSuffix } from '@/constants';
import {
  CLOSE_BUTTON,
  FRIDAY_LABEL,
  MESSAGE_INPUT_EXPLANATION,
  MESSAGE_LABEL,
  MESSAGE_PLACEHOLDER,
  MODAL_TITLE,
  MONDAY_LABEL,
  NAME_EXPLANATION,
  NAME_INPUT_PLACEHOLDER,
  NAME_LABEL,
  PICK_USERS_PLACEHOLDER,
  SATURDAY_LABEL,
  SUBMIT_BUTTON,
  SUNDAY_LABEL,
  TEAM_LABEL,
  THURSDAY_LABEL,
  TUESDAY_LABEL,
  WEDNESDAY_LABEL,
} from '@/i18n';
import { serializeMetadata } from '@/services/metadata';
import { app } from '@/services/slack';
import { deleteMessage } from '@/services/slack/functions/deleteMessage';

app.action<BlockButtonAction>({ action_id: OPEN_MODAL_ACTION }, async ({ ack, body }) => {
  await ack();

  if (!body.channel?.id) return;

  await deleteMessage(body.response_url);

  const modal = Modal({
    callbackId: CREATE_CRON,
    title: MODAL_TITLE,
    submit: SUBMIT_BUTTON,
    close: CLOSE_BUTTON,
    privateMetaData: serializeMetadata({ c: body.channel.id, r: body.response_url }),
  })
    .blocks(...openModalBlocks())
    .buildToObject();

  void app.client.views.open({
    trigger_id: body.trigger_id,
    view: modal,
  });
});

export function openModalBlocks() {
  return [
    Blocks.Input({ label: NAME_LABEL, blockId: 'name' }).element(
      Elements.TextInput({ actionId: 'name_input', placeholder: NAME_INPUT_PLACEHOLDER })
    ),
    Blocks.Context().elements(NAME_EXPLANATION),
    Blocks.Divider(),
    Blocks.Input({ label: MESSAGE_LABEL, blockId: 'message' }).element(
      Elements.TextInput({ actionId: MESSAGE_INPUT_ACTION, placeholder: MESSAGE_PLACEHOLDER }).multiline(true)
    ),
    Blocks.Context().elements(MESSAGE_INPUT_EXPLANATION),
    Blocks.Divider(),
    Blocks.Input({ label: TEAM_LABEL, blockId: 'participants' }).element(
      Elements.UserMultiSelect({ actionId: 'participants_select', placeholder: PICK_USERS_PLACEHOLDER })
    ),
    Blocks.Divider(),
    Blocks.Input({ label: SUNDAY_LABEL, blockId: `${repeatDailyPrefix}_sunday` })
      .optional(true)
      .element(Elements.TimePicker({ actionId: `sunday_${timePickerSuffix}` })),
    Blocks.Input({ label: MONDAY_LABEL, blockId: `${repeatDailyPrefix}_monday` })
      .optional(true)
      .element(Elements.TimePicker({ actionId: `monday_${timePickerSuffix}` })),
    Blocks.Input({ label: TUESDAY_LABEL, blockId: `${repeatDailyPrefix}_tuesday` })
      .optional(true)
      .element(Elements.TimePicker({ actionId: `tuesday_${timePickerSuffix}` })),
    Blocks.Input({ label: WEDNESDAY_LABEL, blockId: `${repeatDailyPrefix}_wednesday` })
      .optional(true)
      .element(Elements.TimePicker({ actionId: `wednesday_${timePickerSuffix}` })),
    Blocks.Input({ label: THURSDAY_LABEL, blockId: `${repeatDailyPrefix}_thursday` })
      .optional(true)
      .element(Elements.TimePicker({ actionId: `thursday_${timePickerSuffix}` })),
    Blocks.Input({ label: FRIDAY_LABEL, blockId: `${repeatDailyPrefix}_friday` })
      .optional(true)
      .element(Elements.TimePicker({ actionId: `friday_${timePickerSuffix}` })),
    Blocks.Input({ label: SATURDAY_LABEL, blockId: `${repeatDailyPrefix}_saturday` })
      .optional(true)
      .element(Elements.TimePicker({ actionId: `saturday_${timePickerSuffix}` })),
  ];
}
