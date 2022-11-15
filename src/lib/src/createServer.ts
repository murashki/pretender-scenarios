import Pretender from 'pretender';

import { createContext } from './context';
import { isRequestLink, runGenerator } from './handleRequest';
import { BaseContext, Context, FakeRequest, RequestHandler, ResponseData, ResponseHandler,
  PretenderServer, PretenderServerRequestMethod } from './types';

export class Server<TContext extends BaseContext = Context> {
  public readonly pretenderServer: PretenderServer;

  public readonly delete: RequestHandler<TContext>;
  public readonly get: RequestHandler<TContext>;
  public readonly head: RequestHandler<TContext>;
  public readonly options: RequestHandler<TContext>;
  public readonly patch: RequestHandler<TContext>;
  public readonly post: RequestHandler<TContext>;
  public readonly put: RequestHandler<TContext>;

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
  }

  logInterceptedRequest(urlExpression: string, request: FakeRequest, response: ResponseData) {
    const label = 'Fake api request intercept ' + urlExpression;
    let json;
    try {
      json = JSON.parse(response[2]);
    } catch (error) {}
    console.groupCollapsed(label);
    console.log('queryParams', request.queryParams);
    console.log('responseCode', response[0]);
    console.log('responseHeaders', response[1]);
    console.log('response', json ?? response[2]);
    console.groupEnd();
  }
}

let server: PretenderServer;

export function createServer<TContext extends BaseContext = Context>(): Server<TContext> {
  server = server ?? new Pretender();

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
  return function (urlExpression: string, responseHandler: ResponseHandler) {
    const context = server.handleContext(createContext());
    const responseHandlerState = {
      shutdown: false,
      responseHandler,
      context,
      instance: null,
    };

    pretenderServerRequestMethod.call(server.pretenderServer, urlExpression, request => {
      context.getCurrentRequest = function () {
        return request;
      };
      const response = runGenerator(responseHandlerState);

      server.logInterceptedRequest(urlExpression, request, response);

      return response;
    });
  };
}
