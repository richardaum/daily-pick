import { ViewSubmitAction } from '@slack/bolt';

import { settingsView } from '@/actions/listOverflow/openSettings';
import { ADD_PARTICIPANT_INPUT_ACTION, ADD_PARTICIPANT_MODAL_CALLBACK_ID, PARTICIPANT_BLOCK_ID } from '@/constants';
import { EXISTING_USER_ERROR_MESSAGE, SEE_DETAILS_RESUMED_MESSAGE } from '@/i18n';
import { repository } from '@/services/repository';
import { app } from '@/services/slack';
import { deleteMessage } from '@/services/slack/functions/deleteMessage';

app.view<ViewSubmitAction>(
  { type: 'view_submission', callback_id: ADD_PARTICIPANT_MODAL_CALLBACK_ID },
  async ({ ack, body, client }) => {
    const {
      c: cronId,
      r: responseUrl,
      ch: channelId,
    } = JSON.parse(body.view.private_metadata) as { c: string; r: string; ch: string };

    const user = body.view.state.values[PARTICIPANT_BLOCK_ID][ADD_PARTICIPANT_INPUT_ACTION].selected_user as string;

    const cron = await repository.fetchCronById(cronId);
    if (!cron) throw new Error(`The cron ${cronId} was not found`);

    if (cron.users.includes(user)) {
      await ack({
        response_action: 'errors',
        errors: {
          [PARTICIPANT_BLOCK_ID]: EXISTING_USER_ERROR_MESSAGE,
        },
      });
      return;
    }

    await ack();

    const updatedCron = { ...cron, users: [...cron.users, user] };

    await repository.updateCron(updatedCron);
    await deleteMessage(responseUrl);

    await client.chat.postEphemeral({
      channel: channelId,
      user: body.user.id,
      text: SEE_DETAILS_RESUMED_MESSAGE,
      blocks: settingsView(updatedCron).blocks,
    });
  }
);
