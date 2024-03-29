import { BlockAction, OverflowAction } from '@slack/bolt';
import axios from 'axios';

import { listCronsView } from '@/commands/daily/list';
import { buildCronId, stopCron } from '@/services/cron';
import { repository } from '@/services/repository';

export const removeCron = async ({ body, cronId }: { body: BlockAction<OverflowAction>; cronId: string }) => {
  if (!body.channel?.id || !body.team?.id) return;

  // Remotely destroy and locally stop crons
  const cron = await repository.destroyCron(cronId);
  cron?.intervals.forEach((interval) => {
    stopCron(buildCronId(cron.id, interval));
  });

  const crons = await repository.fetchCronsByChannelAndTeam(body.channel.id, body.team.id);

  await axios.post(body.response_url, listCronsView(crons).buildToObject());
};
