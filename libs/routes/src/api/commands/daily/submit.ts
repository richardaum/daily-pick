import { SlackViewAction } from '@slack/bolt';
import { Response } from 'express';
import { Request, ViewSubmissionRequest } from './types';
import { schedule } from '@daily-pick/cron';
import { slack } from '@daily-pick/bolt';

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

  // eslint-disable-next-line no-debugger
  debugger;
  inputs.filter(Boolean).forEach(async (input) => {
    // schedule(`0 ${input.value}`, () => {
    //   slack.client.chat.postMessage({
    //     channel: payload.view.private_metadata,
    //   });
    // });
  });

  res.end();
}
