import { BlockButtonAction } from '@slack/bolt';

import { settingsView } from './listOverflow/openSettings';

import { MESSAGE_SETTINGS_ACTION } from '@/constants';
import { SETTINGS_TEXT } from '@/i18n';
import { repository } from '@/services/repository';
import { app } from '@/services/slack';

app.action<BlockButtonAction>(
  { type: 'block_actions', action_id: MESSAGE_SETTINGS_ACTION },
  async ({ ack, action, body }) => {
    await ack();
    const { c: cronId } = JSON.parse(action.value);
    const cron = await repository.fetchCronById(cronId);

    if (!cron) throw new Error(`The cron ${cronId} was not found`);
    if (!body.channel) throw new Error(`Channel not found`);

    const view = settingsView(cron);

    await app.client.chat.postEphemeral({
      channel: body.channel.id,
      user: body.user.id,
      blocks: view.blocks,
      text: SETTINGS_TEXT.replace('{cronName}', cron.name),
    });
  }
);
