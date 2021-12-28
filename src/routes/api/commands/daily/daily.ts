import { BlockAction } from '@slack/bolt';
import axios from 'axios';
import { Response } from 'express';
import { Surfaces } from 'slack-block-builder';

import { isDaily, updateModalRepeatDaily } from './isDaily';
import { isListingCrons, listCrons } from './list';
import { isRequestingToOpenModal, openModal } from './openModal';
import { isSubmitting, submit } from './submit';
import { BlockActionRequest, Request } from './utils/types';

import { api } from '@/services/express';

api.post('/api/commands/daily/pick', async (req: Request, res) => {
  if (isListingCrons(req)) return await listCrons(req, res);
  if (isRequestingToOpenModal(req)) return await openModal(req, res);
  res.send("I didn't understand that command.");
});

api.post('/api/commands/daily/act', async (req: Request, res: Response) => {
  if (isClosingList(req)) return await closeList(req, res);
  if (isDaily(req)) return await updateModalRepeatDaily(req, res);
  if (isSubmitting(req)) return await submit(req, res);
  res.send("I didn't understand that action.");
});

export function isClosingList(req: Request): req is BlockActionRequest {
  if (!req.body.payload) return false;
  const payload = JSON.parse(req.body.payload) as BlockAction;
  return payload.type === 'block_actions' && payload.actions[0]?.action_id === 'close_list';
}

export function closeList(req: Request, res: Response): void | PromiseLike<void> {
  const payload = JSON.parse(req.body.payload) as BlockAction;
  axios.post(payload.response_url, Surfaces.Message().deleteOriginal(true).buildToObject());
  res.end();
}
