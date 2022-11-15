import { BlockAction } from '@slack/bolt';
import axios from 'axios';
import { Surfaces } from 'slack-block-builder';

import { DELETE_MESSAGE_ACTION } from '../constants/actions';

import { app } from '@/services/slack';

app.action<BlockAction>({ type: 'block_actions', action_id: DELETE_MESSAGE_ACTION }, async ({ ack, body }) => {
  await ack();
  axios.post(body.response_url, Surfaces.Message().deleteOriginal(true).buildToObject());
});
