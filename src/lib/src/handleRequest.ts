import {
  PASSTHROUGH_COMMAND_TYPE,
  RESPONSE_COMMAND_TYPE,
  SHUTDOWN_COMMAND_TYPE,
  TAKE_REQUEST_COMMAND_TYPE,
} from './command';
import { RequestLink } from './requestLink';
import {
  Command,
  Context,
  RequestLinkStatus,
  ResponseData,
  ResponseHandlerInstance,
} from './types';

function getEndlessScenarioMessage(key: string) {
  return key + ' response handler has an endless scenario behaviour';
}

function getIncorrectCommandMessage(key: string) {
  return key + ' response handler returned incorrect command';
}

export function runGenerator(
  context: Context,
  responseHandlerInstance: ResponseHandlerInstance,
): ResponseData | RequestLink {
  if (responseHandlerInstance.shutdown) {
    return new RequestLink(RequestLinkStatus.SHUTDOWN);
  }

  if (responseHandlerInstance.await) {
    const currentRequest = context.getCurrentRequest();
    const pass = responseHandlerInstance.await(currentRequest);
    if (pass) {
      responseHandlerInstance.await = null;
      responseHandlerInstance.nextValue = currentRequest;
      return runGenerator(context, responseHandlerInstance);
    }
    return new RequestLink(RequestLinkStatus.AWAIT);
  }

  if (responseHandlerInstance.generatorInstance == null) {
    responseHandlerInstance.generatorInstance = responseHandlerInstance.handler(context);
  }

  const nextValue = responseHandlerInstance.nextValue;
  responseHandlerInstance.nextValue = undefined;
  const iteratorResult = responseHandlerInstance.generatorInstance.next(nextValue);

  if (iteratorResult.done) {
    const used = responseHandlerInstance.used;
    responseHandlerInstance.used = false;
    responseHandlerInstance.generatorInstance = null;

    if (used) {
      return runGenerator(context, responseHandlerInstance);
    }
    throw new Error(getEndlessScenarioMessage(responseHandlerInstance.handlerKey));
  }

  const command = iteratorResult.value as Command;

  switch (command.type) {
    case RESPONSE_COMMAND_TYPE: {
      responseHandlerInstance.used = true;
      return typeof command.payload === 'function' ? command.payload() : command.payload;
    }
    case PASSTHROUGH_COMMAND_TYPE: {
      responseHandlerInstance.used = true;
      return new RequestLink(RequestLinkStatus.PASSTHROUGH);
    }
    case SHUTDOWN_COMMAND_TYPE: {
      responseHandlerInstance.shutdown = true;
      return new RequestLink(RequestLinkStatus.SHUTDOWN);
    }
    case TAKE_REQUEST_COMMAND_TYPE: {
      responseHandlerInstance.await = command.payload ?? (() => true);
      return runGenerator(context, responseHandlerInstance);
    }
    default: {
      throw new Error(getIncorrectCommandMessage(responseHandlerInstance.handlerKey));
    }
  }
}
