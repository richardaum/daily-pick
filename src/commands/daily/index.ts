import { help } from './help';
import { isListingCrons, listCrons } from './list';
import { isOpeningModal, openModal } from './openModal';
import { isOutsideChannel, warnOutsideChannel } from './warnOutsideChannel';

import { slack as app } from '@/services/slack';

app.command('/daily', async ({ command, ack, body, respond }) => {
  await ack();

  if (isOutsideChannel(body)) return await warnOutsideChannel(respond);
  if (isListingCrons(command)) return await listCrons(body, respond);
  if (isOpeningModal(body)) return await openModal(body);

  await help(respond);
});
