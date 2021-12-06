import { Request, ViewSubmissionRequest } from './types';
import { Response } from 'express';
import { SlackViewAction } from '@slack/bolt';
import { Blocks, Elements, Modal } from 'slack-block-builder';
import { CustomBlocks } from './CustomBlocks';

export function isGoingToRepeatEveryWeekView(req: Request): req is ViewSubmissionRequest {
  if (!req.body.payload) return false;
  const payload = JSON.parse(req.body.payload) as SlackViewAction;
  const from = payload.view?.external_id;
  return payload.type === 'view_submission' && from === 'first_modal';
}

export async function updateModalRepeatEveryWeek(req: Request, res: Response) {
  const payload = JSON.parse(req.body.payload) as SlackViewAction;
  const view = Modal({
    callbackId: 'daily-pick',
    title: 'Daily Pick',
    submit: 'Submit',
    externalId: 'modal_repeat_every_week',
    privateMetaData: payload.view.private_metadata,
  })
    .blocks(
      Blocks.Section({ text: 'Only fill the days that you have a daily meeting', blockId: 'repeat_every_week_label' }),
      CustomBlocks.Input({ optional: true, label: 'Sunday', blockId: 'repeat_every_week_sunday' }).element(
        Elements.TimePicker({ actionId: 'sunday_time_picker' })
      ),
      CustomBlocks.Input({ optional: true, label: 'Monday', blockId: 'repeat_every_week_monday' }).element(
        Elements.TimePicker({ actionId: 'monday_time_picker' })
      ),
      CustomBlocks.Input({ optional: true, label: 'Tuesday', blockId: 'repeat_every_week_tuesday' }).element(
        Elements.TimePicker({ actionId: 'tuesday_time_picker' })
      ),
      CustomBlocks.Input({ optional: true, label: 'Wednesday', blockId: 'repeat_every_week_wednesday' }).element(
        Elements.TimePicker({ actionId: 'wednesday_time_picker' })
      ),
      CustomBlocks.Input({ optional: true, label: 'Thursday', blockId: 'repeat_every_week_thursday' }).element(
        Elements.TimePicker({ actionId: 'thursday_time_picker' })
      ),
      CustomBlocks.Input({ optional: true, label: 'Friday', blockId: 'repeat_every_week_friday' }).element(
        Elements.TimePicker({ actionId: 'friday_time_picker' })
      ),
      CustomBlocks.Input({ optional: true, label: 'Saturday', blockId: 'repeat_every_week_saturday' }).element(
        Elements.TimePicker({ actionId: 'saturday_time_picker' })
      )
    )
    .buildToObject();

  res.json({ response_action: 'update', view });
}
