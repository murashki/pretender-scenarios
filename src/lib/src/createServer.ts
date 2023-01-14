import Pretender from 'pretender';

import { createRequestHandler } from './createRequestHandler';
import {
  BaseContext,
  Context,
  FakeRequest,
  PretenderServer,
  PretenderServerRequestHandler,
  RequestHandler,
  ResponseHandlerBank,
  Verb,
} from './types';

export class Server<TContext extends BaseContext = Context> {
  public readonly pretenderServer: PretenderServer;

  public readonly delete: RequestHandler<TContext>;
  public readonly get: RequestHandler<TContext>;
  public readonly head: RequestHandler<TContext>;
  public readonly options: RequestHandler<TContext>;
  public readonly patch: RequestHandler<TContext>;
  public readonly post: RequestHandler<TContext>;
  public readonly put: RequestHandler<TContext>;

  public erroredRequest: PretenderServer['erroredRequest'];

  constructor(pretenderServer: PretenderServer) {
    this.pretenderServer = pretenderServer;

    this.pretenderServer.handledRequest = (_verb, _path, request: FakeRequest) => {
      this.logHandledRequest(request);
    };

    this.pretenderServer.unhandledRequest = (_verb, _path, request: FakeRequest) => {
      request.passthrough();
    };

    this.erroredRequest = this.pretenderServer.erroredRequest.bind(this.pretenderServer);

    const responseHandlerBank: ResponseHandlerBank = {};

    type CreateMethodHandler = (
      verb: Verb,
      requestHandler: PretenderServerRequestHandler,
    ) => RequestHandler<TContext>;

    const createMethodHandler = createRequestHandler.bind(
      undefined,
      this,
      responseHandlerBank,
    ) as CreateMethodHandler;

    this.delete = createMethodHandler(Verb.DELETE, pretenderServer.delete);
    this.get = createMethodHandler(Verb.GET, pretenderServer.get);
    this.head = createMethodHandler(Verb.HEAD, pretenderServer.head);
    this.options = createMethodHandler(Verb.OPTIONS, pretenderServer.options);
    this.patch = createMethodHandler(Verb.PATCH, pretenderServer.patch);
    this.post = createMethodHandler(Verb.POST, pretenderServer.post);
    this.put = createMethodHandler(Verb.PUT, pretenderServer.put);
  }

  logHandledRequest = (request: FakeRequest) => console.log('Fake api request', request);

  handleContext = (context: Context): Context => context;
}

export function createServer<TContext extends BaseContext = Context>(): Server<TContext> {
  return new Server(new Pretender());
}
