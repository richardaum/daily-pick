import { destroyCron } from '@/services/repository/postgresql/functions/destroyCron';
import { fetchCronById } from '@/services/repository/postgresql/functions/fetchCronById';
import { fetchCrons } from '@/services/repository/postgresql/functions/fetchCrons';
import { fetchCronsByChannelAndTeam } from '@/services/repository/postgresql/functions/fetchCronsByChannelAndTeam';
import { getUsers } from '@/services/repository/postgresql/functions/getUsers';
import { persistCron } from '@/services/repository/postgresql/functions/persistCron';
import { updateCron } from '@/services/repository/postgresql/functions/updateCron';
import { updateCurrentUser } from '@/services/repository/postgresql/functions/updateCurrentUser';
import { updateLastMessage } from '@/services/repository/postgresql/functions/updateLastMessage';
import { Repository } from '@/types';

export const postgresqlRepository: Repository = {
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
