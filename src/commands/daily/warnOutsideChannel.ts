import { RespondFn, SlashCommand } from '@slack/bolt';

import { OUTSIDE_CHANNEL_MESSAGE } from '@/i18n';

export function isOutsideChannel(body: SlashCommand) {
  return body.channel_name === 'directmessage';
}

export async function warnOutsideChannel(respond: RespondFn) {
  await respond(OUTSIDE_CHANNEL_MESSAGE);
}
