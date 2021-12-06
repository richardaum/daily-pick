import { api } from '@daily-pick/express';

api.get('/api', (_, res) => {
  res.json({ message: 'Welcome to Daily Pick API!!' });
});
