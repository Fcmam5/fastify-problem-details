import fastify, { FastifyInstance } from 'fastify';
import p from '../src';

describe('problemReply plugin', () => {
  let app: FastifyInstance;

  beforeEach(() => {
    app = fastify();
    app.register(p);
  });

  afterEach(() => {
    app.close();
  });

  test('should add myPluginProp to reply', async () => {
    app.get('/', (_, reply) => reply.problem({ status: 200 }));

    await app.ready();

    const response = await app.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('application/problem+json');
    expect(response.json()).toEqual({ status: 200, type: 'about:blank' });
  });
});
