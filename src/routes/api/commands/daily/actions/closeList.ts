import { BlockAction } from '@slack/bolt';
import axios from 'axios';
import { Response } from 'express';
import { Surfaces } from 'slack-block-builder';

import { BlockActionRequest, Request } from '../utils/types';

export function isClosingList(req: Request): req is BlockActionRequest {
  if (!req.body.payload) return false;
  const payload = JSON.parse(req.body.payload) as BlockAction;
  return payload.type === 'block_actions' && payload.actions[0]?.action_id === 'close_list';
}

export function closeList(req: Request, res: Response) {
  const payload = JSON.parse(req.body.payload) as BlockAction;
  axios.post(payload.response_url, Surfaces.Message().deleteOriginal(true).buildToObject());
  res.end();
}
