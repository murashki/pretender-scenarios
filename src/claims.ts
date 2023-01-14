import {
  createServer,
} from './lib';

export const server = createServer();

server.get('/claims/*', function *(ctx) {
  yield ctx.response([200, {}, JSON.stringify({ claims: [{ id: 'cmd 1' }] })]);
  yield ctx.response([200, {}, JSON.stringify({ claims: [{ id: 'cmd 2' }] })]);
});
