import { Request, Response, SlashCommandRequest } from '../utils/types';

import { OUTSIDE_CHANNEL_MESSAGE } from '@/i18n';

export function isOutsideChannel(req: Request) {
  const request = req as SlashCommandRequest;
  return request.body.channel_name === 'directmessage';
}

export function warnOutsideChannel(_: Request, res: Response) {
  res.end(OUTSIDE_CHANNEL_MESSAGE);
}
