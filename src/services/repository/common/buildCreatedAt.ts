import { DateTime } from 'luxon';

import { TIMEZONE } from '@/constants';

export const buildCreatedAt = (date?: Date) => {
  if (!date) return 'Invalid date';
  return DateTime.fromJSDate(date).setZone(TIMEZONE).toISO();
};
