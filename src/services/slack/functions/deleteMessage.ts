import axios from 'axios';
import { Surfaces } from 'slack-block-builder';

export const deleteMessage = async (responseUrl: string) => {
  await axios.post(responseUrl, Surfaces.Message().deleteOriginal(true).buildToObject());
};
