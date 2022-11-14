import { BlockAction, OverflowAction } from '@slack/bolt';

import { triggerCron } from './triggerCron';

import { removeCron } from '@/actions/listOverflow/removeCron';
import { seeDetails } from '@/actions/listOverflow/seeDetails';
import { LIST_OVERFLOW_CLICK_ACTION, REMOVE_CRON_ACTION, SEE_DETAILS_ACTION } from '@/constants';
import { TRIGGER_ACTION } from '@/i18n';
import { slack as app } from '@/services/slack';

app.action<BlockAction<OverflowAction>>(
  { type: 'block_actions', action_id: LIST_OVERFLOW_CLICK_ACTION },
  async ({ ack, action, body, respond }) => {
    await ack();

    const [overflowMenuItem, cronId] = action.selected_option.value.split('#');

    if (overflowMenuItem === REMOVE_CRON_ACTION) await removeCron({ body, cronId });
    if (overflowMenuItem === SEE_DETAILS_ACTION) await seeDetails({ body, cronId, respond });
    if (overflowMenuItem === TRIGGER_ACTION) await triggerCron({ body, cronId, respond });
  }
);
