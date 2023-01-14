import {
  ContextRequest,
  PassthroughCommand,
  ResponseCommand,
  ShutdownCommand,
  TakeRequestCommand,
} from './';

export type BaseContext = {
  getCurrentRequest: (...args: any[]) => ContextRequest;
  response: (...args: any[]) => ResponseCommand;
  passthrough: (...args: any[]) => PassthroughCommand;
  shutdown: (...args: any[]) => ShutdownCommand;
  takeRequest: (...args: any[]) => TakeRequestCommand;
};
