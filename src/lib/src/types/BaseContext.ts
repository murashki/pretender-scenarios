import {
  FakeRequest,
  PassthroughCommand,
  ResponseCommand,
  ShutdownCommand,
} from './index';

export type BaseContext = {
  getCurrentRequest: (...args: any[]) => FakeRequest;
  response: (...args: any[]) => ResponseCommand;
  passthrough: (...args: any[]) => PassthroughCommand;
  shutdown: (...args: any[]) => ShutdownCommand;
};
