import { CustomRoute } from '@slack/bolt';

export function health() {
  return {
    path: '/api/health',
    method: 'GET',
    handler: ((req, res) => {
      res.writeHead(200);
      res.end(`Things are going just fine at ${req.headers.host}!`);
    }) as CustomRoute['handler'],
  };
}
