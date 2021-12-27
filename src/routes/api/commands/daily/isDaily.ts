import { BlockAction } from '@slack/bolt';
import { Response } from 'express';
import { Blocks, Elements, Modal } from 'slack-block-builder';

import { BlockActionRequest, Request } from './utils/types';

export function isDaily(req: Request): req is BlockActionRequest {
  if (!req.body.payload) return false;
  const payload = JSON.parse(req.body.payload) as BlockAction;
  const from = payload.view?.callback_id;
  return payload.type === 'block_actions' && from === 'openModal';
}

export async function updateModalRepeatDaily(req: Request, res: Response) {
  const payload = JSON.parse(req.body.payload) as BlockAction;
  const view = Modal({
    callbackId: 'updateModalRepeatEveryWeek',
    title: 'Daily Pick',
    submit: 'Submit',
    privateMetaData: payload.view?.private_metadata,
  })
    .blocks(
      Blocks.Section({ text: 'Only fill the days that you have a daily meeting', blockId: 'repeat_every_week_label' }),
      Blocks.Input({ label: 'Sunday', blockId: 'repeat_every_week_sunday' })
        .optional(true)
        .element(Elements.TimePicker({ actionId: 'sunday_time_picker' })),
      Blocks.Input({ label: 'Monday', blockId: 'repeat_every_week_monday' })
        .optional(true)
        .element(Elements.TimePicker({ actionId: 'monday_time_picker' })),
      Blocks.Input({ label: 'Tuesday', blockId: 'repeat_every_week_tuesday' })
        .optional(true)
        .element(Elements.TimePicker({ actionId: 'tuesday_time_picker' })),
      Blocks.Input({ label: 'Wednesday', blockId: 'repeat_every_week_wednesday' })
        .optional(true)
        .element(Elements.TimePicker({ actionId: 'wednesday_time_picker' })),
      Blocks.Input({ label: 'Thursday', blockId: 'repeat_every_week_thursday' })
        .optional(true)
        .element(Elements.TimePicker({ actionId: 'thursday_time_picker' })),
      Blocks.Input({ label: 'Friday', blockId: 'repeat_every_week_friday' })
        .optional(true)
        .element(Elements.TimePicker({ actionId: 'friday_time_picker' })),
      Blocks.Input({ label: 'Saturday', blockId: 'repeat_every_week_saturday' })
        .optional(true)
        .element(Elements.TimePicker({ actionId: 'saturday_time_picker' }))
    )
    .buildToObject();

  res.json({ response_action: 'update', view });
  // res.end();
}
