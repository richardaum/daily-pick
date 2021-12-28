import { BlockAction, ButtonAction } from '@slack/bolt';
import axios from 'axios';
import { Response } from 'express';

import { listCronsView } from './list';
import { BlockActionRequest, Request } from './utils/types';

import { destroyCron, fetchCrons } from '@/services/database/crons';

export function isRemovingCron(req: Request): req is BlockActionRequest {
  if (!req.body.payload) return false;
  const payload = JSON.parse(req.body.payload) as BlockAction;
  return payload.type === 'block_actions' && payload.actions[0]?.action_id === 'remove';
}

export async function removeCron(req: Request, res: Response) {
  const payload = JSON.parse(req.body.payload) as BlockAction;
  const action = payload.actions[0] as ButtonAction;
  await destroyCron(action.value);
  const crons = await fetchCrons();
  // stopcron
  axios.post(payload.response_url, listCronsView(crons).buildToObject());
  res.end();
}
