import { BlockAction } from '@slack/bolt';

import { listCronsView } from '@/commands/daily/list';
import { BACK_TO_LIST_ACTION } from '@/constants';
import { repository } from '@/services/repository';
import { app } from '@/services/slack';

app.action<BlockAction>({ type: 'block_actions', action_id: BACK_TO_LIST_ACTION }, async ({ ack, body, respond }) => {
  await ack();

  if (!body.channel?.id || !body.team?.id) return;

  const crons = await repository.fetchCronsByChannelAndTeam(body.channel?.id, body.team.id);
  const message = listCronsView(crons).buildToObject();
  await respond(message);
});
