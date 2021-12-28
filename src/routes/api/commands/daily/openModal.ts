import { Response } from 'express';
import { Blocks, Elements, Modal } from 'slack-block-builder';

import { Request, SlashCommandRequest } from './utils/types';

import { slack } from '@/services/slack';

export const OPEN_MODAL = 'openModal';
export const repeatDailyPrefix = 'repeat_daily';
export const timePickerSuffix = 'time_picker';

export function isOpeningModal(req: Request): req is SlashCommandRequest {
  return 'trigger_id' in req.body && !req.body.text;
}

export async function openModal(req: SlashCommandRequest, res: Response) {
  const modal = Modal({
    callbackId: 'openModal',
    title: 'Daily Pick',
    submit: 'Submit',
    privateMetaData: req.body.channel_id,
  })
    .blocks(...openModalBlocks())
    .buildToObject();

  slack.client.views.open({
    trigger_id: req.body.trigger_id,
    view: modal,
  });

  res.end();
}

export function openModalBlocks() {
  return [
    Blocks.Input({ label: 'Select users', blockId: 'participants' }).element(
      Elements.UserMultiSelect({ actionId: 'participants_select', placeholder: 'Pick users here' })
    ),
    Blocks.Header({ text: 'Daily options', blockId: 'daily_options' }),
    Blocks.Input({ label: 'Sunday', blockId: `${repeatDailyPrefix}_sunday` })
      .optional(true)
      .element(Elements.TimePicker({ actionId: `sunday_${timePickerSuffix}` })),
    Blocks.Input({ label: 'Monday', blockId: `${repeatDailyPrefix}_monday` })
      .optional(true)
      .element(Elements.TimePicker({ actionId: `monday_${timePickerSuffix}` })),
    Blocks.Input({ label: 'Tuesday', blockId: `${repeatDailyPrefix}_tuesday` })
      .optional(true)
      .element(Elements.TimePicker({ actionId: `tuesday_${timePickerSuffix}` })),
    Blocks.Input({ label: 'Wednesday', blockId: `${repeatDailyPrefix}_wednesday` })
      .optional(true)
      .element(Elements.TimePicker({ actionId: `wednesday_${timePickerSuffix}` })),
    Blocks.Input({ label: 'Thursday', blockId: `${repeatDailyPrefix}_thursday` })
      .optional(true)
      .element(Elements.TimePicker({ actionId: `thursday_${timePickerSuffix}` })),
    Blocks.Input({ label: 'Friday', blockId: `${repeatDailyPrefix}_friday` })
      .optional(true)
      .element(Elements.TimePicker({ actionId: `friday_${timePickerSuffix}` })),
    Blocks.Input({ label: 'Saturday', blockId: `${repeatDailyPrefix}_saturday` })
      .optional(true)
      .element(Elements.TimePicker({ actionId: `saturday_${timePickerSuffix}` })),
  ];
}
