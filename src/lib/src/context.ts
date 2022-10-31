import { createPassthrough, createResponse, createShutdown } from './command';
import { Context } from './types';

export function createContext(): Context {
  return {
    getCurrentRequest() {
      throw new Error('There is no request yet');
    },
    response: createResponse,
    passthrough: createPassthrough,
    shutdown: createShutdown,
  };
}
