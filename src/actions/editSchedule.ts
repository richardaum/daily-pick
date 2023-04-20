import { BlockButtonAction } from '@slack/bolt';
import { Blocks, Elements, Modal } from 'slack-block-builder';

import {
  daysOfWeek,
  EDIT_SCHEDULE_ACTION,
  MESSAGE_INPUT_ACTION,
  repeatDailyPrefix,
  timePickerSuffix,
  UPDATE_CRON,
} from '@/constants';
import * as I18N from '@/i18n';
import {
  CLOSE_BUTTON,
  MESSAGE_INPUT_EXPLANATION,
  MESSAGE_LABEL,
  MESSAGE_PLACEHOLDER,
  MODAL_TITLE,
  NAME_EXPLANATION,
  NAME_INPUT_PLACEHOLDER,
  NAME_LABEL,
  PICK_USERS_PLACEHOLDER,
  SUBMIT_BUTTON,
  TEAM_LABEL,
} from '@/i18n';
import { getTimePerWeekday } from '@/services/cron';
import { repository } from '@/services/repository';
import { app } from '@/services/slack';
import { deleteMessage } from '@/services/slack/functions/deleteMessage';
import { Cron, TimePerWeeDay } from '@/types';

app.action<BlockButtonAction>({ action_id: EDIT_SCHEDULE_ACTION }, async ({ ack, body, action }) => {
  await ack();

  if (!body.channel?.id) return;

  await deleteMessage(body.response_url);

  const { c: cronId } = JSON.parse(action.value);
  const cron = await repository.fetchCronById(cronId);

  if (!cron) throw new Error(`The cron ${cronId} was not found`);

  const modal = Modal({
    callbackId: UPDATE_CRON,
    title: MODAL_TITLE,
    submit: SUBMIT_BUTTON,
    close: CLOSE_BUTTON,
    privateMetaData: JSON.stringify({ c: cronId }),
  })
    .blocks(...openModalBlocks({ ...cron, timePerWeekDay: getTimePerWeekday(cron.intervals) }))
    .buildToObject();

  void app.client.views.open({
    trigger_id: body.trigger_id,
    view: modal,
  });
});

function openModalBlocks(cron: Cron & { timePerWeekDay: TimePerWeeDay }) {
  return [
    Blocks.Input({ label: NAME_LABEL, blockId: 'name' }).element(
      Elements.TextInput({ actionId: 'name_input', placeholder: NAME_INPUT_PLACEHOLDER, initialValue: cron.name })
    ),
    Blocks.Context().elements(NAME_EXPLANATION),
    Blocks.Divider(),
    Blocks.Input({ label: MESSAGE_LABEL, blockId: 'message' }).element(
      Elements.TextInput({
        actionId: MESSAGE_INPUT_ACTION,
        placeholder: MESSAGE_PLACEHOLDER,
        initialValue: cron.message,
      }).multiline(true)
    ),
    Blocks.Context().elements(MESSAGE_INPUT_EXPLANATION),
    Blocks.Divider(),
    Blocks.Input({ label: TEAM_LABEL, blockId: 'participants' }).element(
      Elements.UserMultiSelect({
        actionId: 'participants_select',
        placeholder: PICK_USERS_PLACEHOLDER,
      }).initialUsers(cron.users)
    ),
    Blocks.Divider(),
    ...daysOfWeek.map((dayOfWeek) => {
      const labelKey = `${dayOfWeek.toUpperCase()}_LABEL` as keyof typeof I18N;
      if (!I18N[labelKey]) throw new Error('Invalid label key for dayOfWeek');
      return Blocks.Input({ label: I18N[labelKey], blockId: `${repeatDailyPrefix}_${dayOfWeek}` })
        .optional(true)
        .element(
          Elements.TimePicker({
            actionId: `${dayOfWeek}_${timePickerSuffix}`,
            initialTime: cron.timePerWeekDay[dayOfWeek],
          })
        );
    }),
  ];
}
