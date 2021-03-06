import { SlackViewAction } from '@slack/bolt';
import { Response } from 'express';

import { Request, ViewSubmissionRequest } from '../utils/types';

import { OPEN_MODAL, repeatDailyPrefix, timePickerSuffix } from './openModal';

import { handleSchedule } from '@/bootstrap/schedule';
import { SELECT_AT_LEAST_ONE_WEEKDAY, UNKNOWN_NAME, WAS_CREATED, YOUR_CRON } from '@/i18n';
import { scheduleMultiple } from '@/services/cron';
import { persistCron } from '@/services/database/functions/persistCron';
import { createLogger } from '@/services/logger';
import { slack } from '@/services/slack';

const logger = createLogger();

export function isCreatingCron(req: Request): req is ViewSubmissionRequest {
  if (!req.body.payload) return false;
  const payload = JSON.parse(req.body.payload) as SlackViewAction;
  const from = payload.view?.callback_id;
  return payload.type === 'view_submission' && from === OPEN_MODAL;
}

export async function createCron(req: Request, res: Response) {
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
        repeat_daily_monday: SELECT_AT_LEAST_ONE_WEEKDAY,
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

  const cron = await persistCron({
    team,
    channel,
    intervals,
    name: payload.view.state.values.name.name_input.value ?? UNKNOWN_NAME,
    users: payload.view.state.values.participants.participants_select.selected_users ?? [],
  });

  scheduleMultiple([cron], (cron) => {
    logger.debug({ hint: 'cron is running', cron });

    handleSchedule(cron);
  });

  logger.debug({ hint: 'cron is scheduled', cron });

  await slack.client.chat.postEphemeral({
    channel,
    user: payload.user.id,
    text: `${YOUR_CRON} "${cron.name}" ${WAS_CREATED}`,
  });

  logger.debug({ hint: 'slack message is sent', cron });

  res.end();
}
