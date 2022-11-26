import { destroyCron } from '@/services/repository/sqlite/functions/destroyCron';
import { fetchCronById } from '@/services/repository/sqlite/functions/fetchCronById';
import { fetchCrons } from '@/services/repository/sqlite/functions/fetchCrons';
import { fetchCronsByChannelAndTeam } from '@/services/repository/sqlite/functions/fetchCronsByChannelAndTeam';
import { getUsers } from '@/services/repository/sqlite/functions/getUsers';
import { persistCron } from '@/services/repository/sqlite/functions/persistCron';
import { updateCron } from '@/services/repository/sqlite/functions/updateCron';
import { updateCurrentUser } from '@/services/repository/sqlite/functions/updateCurrentUser';
import { updateLastMessage } from '@/services/repository/sqlite/functions/updateLastMessage';
import { Repository } from '@/types';

export const sqliteRepository: Repository = {
  destroyCron: destroyCron,
  fetchCrons: fetchCrons,
  fetchCronsByChannelAndTeam: fetchCronsByChannelAndTeam,
  getUsers: getUsers,
  persistCron: persistCron,
  updateCurrentUser: updateCurrentUser,
  updateLastMessage: updateLastMessage,
  fetchCronById: fetchCronById,
  updateCron: updateCron,
};
