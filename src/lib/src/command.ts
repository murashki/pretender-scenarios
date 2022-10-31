import { PassthroughCommand, ResponseCommand, ResponseData, ShutdownCommand } from './types';

export const RESPONSE_COMMAND_TYPE: ResponseCommand['type'] = 'RESPONSE';

export function createResponse(payload: ResponseData): ResponseCommand {
  return {
    type: RESPONSE_COMMAND_TYPE,
    payload,
  };
}

export const PASSTHROUGH_COMMAND_TYPE: PassthroughCommand['type'] = 'PASSTHROUGH';

export function createPassthrough(): PassthroughCommand {
  return {
    type: PASSTHROUGH_COMMAND_TYPE,
  };
}

export const SHUTDOWN_COMMAND_TYPE: ShutdownCommand['type'] = 'SHUTDOWN';

export function createShutdown(): ShutdownCommand {
  return {
    type: SHUTDOWN_COMMAND_TYPE,
  };
}
