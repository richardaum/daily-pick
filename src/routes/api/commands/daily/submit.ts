import { SlackViewAction } from '@slack/bolt';
import { Response } from 'express';

import { repeatDailyPrefix, timePickerSufix } from './isDaily';
import { Request, ViewSubmissionRequest } from './utils/types';

import { scheduleMultiple } from '@/services/cron';
import { updateCurrentUser } from '@/services/database/update';
import { getCurrentUser } from '@/services/database/users';
import { postMessage } from '@/services/slack';

export function isSubmitting(req: Request): req is ViewSubmissionRequest {
  if (!req.body.payload) return false;
  const payload = JSON.parse(req.body.payload) as SlackViewAction;
  const from = payload.view?.callback_id;
  return payload.type === 'view_submission' && from === 'updateModalRepeatDaily';
}

export async function submit(req: Request, res: Response) {
  const payload = JSON.parse(req.body.payload) as SlackViewAction;

  const inputs = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((weekday) => {
    const block = payload.view.state.values[`${repeatDailyPrefix}_${weekday}`];
    const action = block[`${weekday}_${timePickerSufix}`];
    return { value: action.selected_time, weekday };
  });

  if (inputs.every((input) => !input.value)) {
    res.send({
      response_action: 'errors',
      errors: {
        repeat_daily_monday: 'Please select at least one week day',
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
      const channel = payload.view.private_metadata;
      const cron = { interval, team: payload.view.team_id, channel };
      scheduleMultiple([cron], async (cron) => {
        const { current, next } = await getCurrentUser(cron.team, cron.channel);
        await postMessage({ channel: cron.channel, current: current.name, next: next.name });
        await updateCurrentUser(cron.team, cron.channel, next);
      });
    });

  res.end();
}
