import Pretender from 'pretender';

import { createContext } from './context';
import { isRequestLink, runGenerator } from './handleRequest';
import { BaseContext, Context, RequestHandler, PretenderServer, PretenderServerRequestMethod,
  ResponseHandler } from './types';

export class Server<TContext extends BaseContext = Context> {
  public readonly pretenderServer: PretenderServer;

  public delete: RequestHandler<TContext>;
  public get: RequestHandler<TContext>;
  public head: RequestHandler<TContext>;
  public options: RequestHandler<TContext>;
  public patch: RequestHandler<TContext>;
  public post: RequestHandler<TContext>;
  public put: RequestHandler<TContext>;

  constructor(pretenderServer: PretenderServer) {
    this.pretenderServer = pretenderServer;
    this.delete = createRequestHandler(this, pretenderServer.delete) as RequestHandler<TContext>;
    this.get = createRequestHandler(this, pretenderServer.get) as RequestHandler<TContext>;
    this.head = createRequestHandler(this, pretenderServer.head) as RequestHandler<TContext>;
    this.options = createRequestHandler(this, pretenderServer.options) as RequestHandler<TContext>;
    this.patch = createRequestHandler(this, pretenderServer.patch) as RequestHandler<TContext>;
    this.post = createRequestHandler(this, pretenderServer.post) as RequestHandler<TContext>;
    this.put = createRequestHandler(this, pretenderServer.put) as RequestHandler<TContext>;
  }

  handleContext(context: Context): Context {
    return context;
  };
}

let server: PretenderServer;

export function createServer<TContext extends BaseContext = Context>(): Server<TContext> {
  server = server ?? (new Pretender());

  server.unhandledRequest = function (_verb, _path, request) {
    // @ts-ignore
    request.passthrough();
  };

  const erroredRequest = server.erroredRequest;

  server.erroredRequest = function (verb, path, request, error) {
    if (isRequestLink(error)) {
      // @ts-ignore
      request.passthrough();
    } else {
      return erroredRequest.call(server, verb, path, request, error);
    }
  };

  return new Server(server);
}

function createRequestHandler(
  server: Server,
  pretenderServerRequestMethod: PretenderServerRequestMethod,
) {
  return function(urlExpression: string, responseHandler: ResponseHandler) {
    const context = server.handleContext(createContext());
    const responseHandlerState = {
      shutdown: false,
      responseHandler,
      context,
      instance: null,
    };

    pretenderServerRequestMethod.call(server.pretenderServer, urlExpression, (request) => {
      context.getCurrentRequest = function() {
        return request;
      };
      return runGenerator(responseHandlerState);
    });
  }
}
