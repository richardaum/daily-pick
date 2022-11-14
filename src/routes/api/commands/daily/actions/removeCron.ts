import { BlockAction, ButtonAction } from '@slack/bolt';
import axios from 'axios';
import { Response } from 'express';

import { BlockActionRequest, Request } from '../utils/types';

import { listCronsView } from './list';

import { buildCronId, stopCron } from '@/services/cron';
import { repository } from '@/services/repository';

export function isRemovingCron(req: Request): req is BlockActionRequest {
  if (!req.body.payload) return false;
  const payload = JSON.parse(req.body.payload) as BlockAction;
  return payload.type === 'block_actions' && payload.actions[0]?.action_id === 'remove';
}

export async function removeCron(req: Request, res: Response) {
  const payload = JSON.parse(req.body.payload) as BlockAction;
  const action = payload.actions[0] as ButtonAction;

  if (!payload.channel?.id || !payload.team?.id) {
    res.end();
    return;
  }

  // Remotely destroy and locally stop crons
  const cron = await repository.destroyCron(action.value);
  cron.intervals.forEach((interval) => {
    stopCron(buildCronId(cron.id, interval));
  });

  const crons = await repository.fetchCronsByChannelAndTeam(payload.channel.id, payload.team.id);
  axios.post(payload.response_url, listCronsView(crons).buildToObject());
  res.end();
}
