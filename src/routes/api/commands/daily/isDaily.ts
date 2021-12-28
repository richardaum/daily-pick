import { BlockAction } from '@slack/bolt';
import { Response } from 'express';
import { Blocks, Elements, Modal } from 'slack-block-builder';

import { openModalBlocks } from './openModal';
import { BlockActionRequest, Request } from './utils/types';

import { slack } from '@/services/slack';

export function isDaily(req: Request): req is BlockActionRequest {
  if (!req.body.payload) return false;
  const payload = JSON.parse(req.body.payload) as BlockAction;
  const from = payload.view?.callback_id;
  return payload.type === 'block_actions' && from === 'openModal';
}

export async function updateModalRepeatDaily(req: Request, res: Response) {
  const payload = JSON.parse(req.body.payload) as BlockAction;
  const view = Modal({
    callbackId: 'updateModalRepeatDaily',
    title: 'Daily Pick',
    submit: 'Submit',
    privateMetaData: payload.view?.private_metadata,
  })
    .blocks(...openModalBlocks(), ...isDailyBlocks())
    .buildToObject();

  slack.client.views.update({
    view_id: payload.view?.root_view_id ?? undefined,
    hash: payload.view?.hash,
    view,
  });

  res.end();
}

export const repeatDailyPrefix = 'repeat_daily';
export const timePickerSuffix = 'time_picker';

export const isDailyBlocks = () => {
  return [
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
};
