import { BlockAction } from '@slack/bolt';

import { DELETE_MESSAGE_ACTION } from '../constants/actions';

import { app } from '@/services/slack';
import { deleteMessage } from '@/services/slack/functions/deleteMessage';

app.action<BlockAction>({ type: 'block_actions', action_id: DELETE_MESSAGE_ACTION }, async ({ ack, body }) => {
  await ack();
  await deleteMessage(body.response_url);
});
