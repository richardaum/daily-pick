import { SlackViewAction } from '@slack/bolt';
import { Response } from 'express';

import { Request, ViewSubmissionRequest } from './utils/types';

import { scheduleSingle } from '@/cron';
import { slack } from '@/slack';

export function isSubmitting(req: Request): req is ViewSubmissionRequest {
  if (!req.body.payload) return false;
  const payload = JSON.parse(req.body.payload) as SlackViewAction;
  const from = payload.view?.callback_id;
  return (
    payload.type === 'view_submission' && from === 'updateModalRepeatEveryWeek'
  );
}

export async function submit(req: Request, res: Response) {
  const payload = JSON.parse(req.body.payload) as SlackViewAction;

  const inputs = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ].map((weekday) => {
    const block = payload.view.state.values[`repeat_every_week_${weekday}`];
    const action = block[`${weekday}_time_picker`];
    return { value: action.selected_time, weekday };
  });

  if (inputs.every((input) => !input.value)) {
    res.send({
      response_action: 'errors',
      errors: {
        repeat_every_week_monday: 'Please select at least one week day',
      },
    });
    return;
  }

  inputs
    .filter((i) => i.value != null)
    .map((i) => {
      const [hour, minute] = (i.value as string).split(':');
      return { ...i, value: { hour, minute } };
    })
    .forEach(async (input) => {
      const dayWeek = input.weekday.slice(0, 3).toUpperCase();
      const { hour, minute } = input.value;
      const interval = `0 ${minute} ${hour} * * ${dayWeek}`;
      scheduleSingle(interval, () => {
        slack.client.chat.postMessage({
          channel: payload.view.private_metadata,
          text: `:tada: It's time to pick a daily pick! :tada:`,
        });
      });
    });

  res.end();
}
