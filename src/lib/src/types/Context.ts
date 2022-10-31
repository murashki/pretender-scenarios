import {
  GetCurrentRequest,
  PassthroughCommandCreator,
  ResponseCommandCreator,
  ShutdownCommandCreator,
} from './index';

export type Context = {
  getCurrentRequest: GetCurrentRequest;
  response: ResponseCommandCreator;
  passthrough: PassthroughCommandCreator;
  shutdown: ShutdownCommandCreator;
};
