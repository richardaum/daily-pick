import { BlockAction, OverflowAction } from '@slack/bolt';
import axios from 'axios';

import { listCronsView } from '@/commands/daily/list';
import { LIST_OVERFLOW_CLICK_ACTION } from '@/constants';
import { buildCronId, stopCron } from '@/services/cron';
import { repository } from '@/services/repository';
import { slack as app } from '@/services/slack';

app.action<BlockAction<OverflowAction>>(
  { type: 'block_actions', action_id: LIST_OVERFLOW_CLICK_ACTION },
  async ({ ack, action, body }) => {
    await ack();
    const [, cronId] = action.selected_option.value.split('#');

    if (!body.channel?.id || !body.team?.id) return;

    // Remotely destroy and locally stop crons
    const cron = await repository.destroyCron(cronId);
    cron?.intervals.forEach((interval) => {
      stopCron(buildCronId(cron.id, interval));
    });

    const crons = await repository.fetchCronsByChannelAndTeam(body.channel.id, body.team.id);

    await axios.post(body.response_url, listCronsView(crons).buildToObject());
  }
);
