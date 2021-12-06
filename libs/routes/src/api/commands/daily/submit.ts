import { slack } from '@daily-pick/bolt';
import { SlackViewAction } from '@slack/bolt';
import { addSeconds, getUnixTime } from 'date-fns';
import { Response } from 'express';
import { Request, ViewSubmissionRequest } from './types';

export function isSubmitting(req: Request): req is ViewSubmissionRequest {
  if (!req.body.payload) return false;
  const payload = JSON.parse(req.body.payload) as SlackViewAction;
  const from = payload.view?.external_id;
  return payload.type === 'view_submission' && from === 'modal_repeat_every_week';
}

export async function submit(req: Request, res: Response) {
  const payload = JSON.parse(req.body.payload) as SlackViewAction;

  const inputs = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((weekday) => {
    const block = payload.view.state.values[`repeat_every_week_${weekday}`];
    const action = block[`${weekday}_time_picker`];
    return { value: action.selected_time, weekday };
  });

  if (inputs.every((input) => !input.value))
    return res.send({
      response_action: 'errors',
      errors: { repeat_every_week_monday: 'Please select at least one week day' },
    });

  res.end();
}
