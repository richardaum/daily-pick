import { destroyCron } from '@/services/repository/firebase/functions/destroyCron';
import { fetchCronById } from '@/services/repository/firebase/functions/fetchCronById';
import { fetchCrons } from '@/services/repository/firebase/functions/fetchCrons';
import { fetchCronsByChannelAndTeam } from '@/services/repository/firebase/functions/fetchCronsByChannelAndTeam';
import { getUsers } from '@/services/repository/firebase/functions/getUsers';
import { persistCron } from '@/services/repository/firebase/functions/persistCron';
import { updateCron } from '@/services/repository/firebase/functions/updateCron';
import { updateCurrentUser } from '@/services/repository/firebase/functions/updateCurrentUser';
import { updateLastMessage } from '@/services/repository/firebase/functions/updateLastMessage';
import { Repository } from '@/types';

export const firebaseRepository: Repository = {
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
