import { api } from '@/services/express';

api.get('/api', (_, res) => {
  res.json({ message: 'Welcome to Daily Pick API!!' });
});
