import { SlackViewAction } from '@slack/bolt';
import { Response } from 'express';

import { repeatDailyPrefix, timePickerSuffix } from './isDaily';
import { Request, ViewSubmissionRequest } from './utils/types';

import { handleSchedule } from '@/bootstrap/schedule';
import { scheduleMultiple } from '@/services/cron';
import { createCron } from '@/services/database/crons';

export function isSubmitting(req: Request): req is ViewSubmissionRequest {
  if (!req.body.payload) return false;
  const payload = JSON.parse(req.body.payload) as SlackViewAction;
  const from = payload.view?.callback_id;
  return payload.type === 'view_submission' && from === 'updateModalRepeatDaily';
}

export async function submit(req: Request, res: Response) {
  const payload = JSON.parse(req.body.payload) as SlackViewAction;
  const team = payload.view.team_id;
  const channel = payload.view.private_metadata;

  const inputs = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((weekday) => {
    const block = payload.view.state.values[`${repeatDailyPrefix}_${weekday}`];
    const action = block[`${weekday}_${timePickerSuffix}`];
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

  const intervals = inputs
    .filter((i) => i.value != null)
    .map((i) => {
      const [hour, minute] = (i.value as string).split(':');
      const input = { ...i, value: { hour, minute } };
      const dayWeek = input.weekday.slice(0, 3).toUpperCase();
      return `0 ${minute} ${hour} * * ${dayWeek}`;
    });

  const cron = await createCron({
    team,
    channel,
    intervals,
    users: payload.view.state.values.participants.participants_select.selected_users ?? [],
  });

  scheduleMultiple([cron], handleSchedule);

  res.end();
}
