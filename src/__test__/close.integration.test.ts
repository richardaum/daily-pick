import { BlockAction } from '@slack/bolt';
import axios from 'axios';
import { mocked } from 'jest-mock';

import { request } from './server';

import { close } from '@/__test__/fixtures/close';

jest.mock('@/bootstrap/schedule');

describe('closeList', () => {
  it('should display an empty list', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({});

    const payload = JSON.parse(close.body.payload) as BlockAction;
    const req = request().post('/api/commands/daily/act');
    const res = await req.send(close.body);

    const post = mocked(axios.post, true);
    expect(post).toHaveBeenCalled();

    const parameters = post.mock.calls[0];
    expect(parameters[0]).toBe(payload.response_url);
    expect(parameters[1]).toEqual({ delete_original: true });

    expect(res.statusCode).toBe(200);
  });
});
