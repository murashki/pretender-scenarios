import { PASSTHROUGH_COMMAND_TYPE, RESPONSE_COMMAND_TYPE, SHUTDOWN_COMMAND_TYPE } from './command';
import { Command, ResponseData, ResponseHandlerState } from './types';

export class RequestLink extends Error {
  __requestLink__: true;

  constructor(message: string = 'Request link') {
    super(message);
    this.__requestLink__ = true;
  }
}

export function isRequestLink(error: Error) {
  return error instanceof RequestLink;
}

export function runGenerator(responseHandlerState: ResponseHandlerState): ResponseData {
  if (responseHandlerState.shutdown) {
    throw new RequestLink();
  }

  if (responseHandlerState.instance == null) {
    responseHandlerState.instance = responseHandlerState.responseHandler(responseHandlerState.context);
  }

  const iteratorResult = responseHandlerState.instance.next();

  if (iteratorResult.done) {
    responseHandlerState.instance = responseHandlerState.responseHandler(responseHandlerState.context);
    return runGenerator(responseHandlerState);
  }

  const command = iteratorResult.value as Command;

  switch (command.type) {
    case RESPONSE_COMMAND_TYPE: {
      return command.payload;
    }
    case PASSTHROUGH_COMMAND_TYPE: {
      throw new RequestLink();
    }
    case SHUTDOWN_COMMAND_TYPE: {
      responseHandlerState.shutdown = true;
      throw new RequestLink();
    }
    default: {
      throw new Error('Incorrect command');
    }
  }
}
