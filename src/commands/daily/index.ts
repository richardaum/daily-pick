import { help } from './help';
import { isListingCrons, listCrons } from './list';
import { isOutsideChannel, warnOutsideChannel } from './warnOutsideChannel';

import { isPicking, pick } from '@/commands/daily/pick';
import { slack as app } from '@/services/slack';

app.command('/daily', async ({ command, ack, body, respond }) => {
  await ack();

  if (isOutsideChannel(body)) return await warnOutsideChannel(respond);
  if (isListingCrons(command)) return await listCrons(body, respond);
  if (isPicking(body)) return await pick({ respond });

  await help(respond);
});
