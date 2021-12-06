import { api } from '@daily-pick/express';
import { Request, Response } from 'express';

api.get('/api/event', async (req: Request, res: Response) => {
  res.json({ challenge: req.body.challenge });
});

api.post('/api/event', async (req: Request, res: Response) => {
  res.json({ challenge: req.body.challenge });
});
