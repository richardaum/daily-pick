import { buildCronToSQLite } from '../../../cron/index';

import { database } from '@/services/repository/postgresql';
import { Repository } from '@/types';

export const updateCron: Repository['updateCron'] = async (cron) => {
  const queryParts: string[] = [];
  const values: (string | undefined)[] = [];

  const formattedCron = buildCronToSQLite(cron);
  let valueIndex = 1;

  for (const key of Object.keys(formattedCron)) {
    if (key !== 'id') {
      queryParts.push(`"${key}" = $${valueIndex}`);
      const value = formattedCron[key as keyof typeof formattedCron];
      values.push(value);
      valueIndex++;
    }
  }

  // Adicione o ID ao final do array de valores
  values.push(formattedCron.id);

  const query = `
    UPDATE cron
    SET ${queryParts.join(', ')}
    WHERE id = $${valueIndex}
  `;

  await database().query(query, values);

  return cron;
};
