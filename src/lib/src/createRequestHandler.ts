import { createContext } from './context';
import { Server } from './createServer';
import { runGenerator } from './handleRequest';
import {
  ContextRequest,
  FakeRequest,
  RequestLinkStatus,
  ResponseHandler,
  ResponseHandlerBank,
  ResponseHandlerKey,
  ResponseHandlerInstance,
  ResponseHandlerLink,
  PretenderServerRequestHandler,
  PretenderServerResponseHandler,
  Verb,
} from './types';
import { checkRequestLink } from './requestLink';

function createResponseHandlerLink(
  handler: ResponseHandler,
  responseHandlerKey: ResponseHandlerKey,
): ResponseHandlerLink {
  return {
    handlerInstances: [createResponseHandlerInstance(handler, responseHandlerKey)],
  };
}

function createResponseHandlerInstance(
  handler: ResponseHandler,
  handlerKey: ResponseHandlerKey,
): ResponseHandlerInstance {
  return {
    handler,
    handlerKey,
    used: false,
    generatorInstance: null,
    nextValue: undefined,
    await: null,
    shutdown: false,
  };
}

function getNoCommandsFoundMessage(key: string) {
  return 'No commands found in ' + key + ' response handler';
}

function getCurrentRequest(request: FakeRequest): ContextRequest {
  let requestBodyParsed = request.requestBody;
  try {
    requestBodyParsed = JSON.parse(request.requestBody);
  } catch {}

  return {
    method: request.method,
    headers: request.requestHeaders,
    url: request.url,
    params: request.params,
    queryParams: request.queryParams,
    body: requestBodyParsed,
    // @ts-ignore
    __request__: request, // Если чего-то не хватит... Это стоит добавить в объект.
  };
}

export function createRequestHandler(
  server: Server,
  bank: ResponseHandlerBank,
  verb: Verb,
  requestHandler: PretenderServerRequestHandler,
) {
  return (urlExpression: string, responseHandler: ResponseHandler) => {
    const responseHandlerKey: ResponseHandlerKey = `${verb}#${urlExpression}`;
    const responseHandlerLink = bank[responseHandlerKey];

    if (responseHandlerLink) {
      responseHandlerLink.handlerInstances.unshift(
        createResponseHandlerInstance(responseHandler, responseHandlerKey),
      );
    } else {
      const context = server.handleContext(createContext());

      const responseHandlerLink = createResponseHandlerLink(responseHandler, responseHandlerKey);

      const handler = ((request: FakeRequest) => {
        context.getCurrentRequest = () => getCurrentRequest(request);

        try {
          for (let instance of responseHandlerLink.handlerInstances) {
            const response = runGenerator(context, instance);

            switch (true) {
              case checkRequestLink(response, RequestLinkStatus.PASSTHROUGH): {
                request.passthrough();
                return;
              }
              case checkRequestLink(response, RequestLinkStatus.AWAIT): {
                break;
              }
              case checkRequestLink(response, RequestLinkStatus.SHUTDOWN): {
                break;
              }
              default: {
                return response;
              }
            }
          }

          throw new Error(getNoCommandsFoundMessage(responseHandlerKey));
        } catch (error) {
          return server.erroredRequest(verb, urlExpression, request, error as Error);
        }
      }) as PretenderServerResponseHandler;

      // @ts-ignore
      requestHandler.call(server.pretenderServer, urlExpression, handler, getDelay);
      bank[responseHandlerKey] = responseHandlerLink;
    }
  };
}

const getDelay = () => Math.floor(Math.random() * 1000);
