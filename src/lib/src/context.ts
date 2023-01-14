import { createPassthrough, createResponse, createShutdown, createTakeRequest } from './command';
import { Context } from './types';

export function createContext(): Context {
  return {
    getCurrentRequest() {
      throw new Error('There is no request yet');
    },
    response: createResponse,
    passthrough: createPassthrough,
    shutdown: createShutdown,
    takeRequest: createTakeRequest,
  };
}
