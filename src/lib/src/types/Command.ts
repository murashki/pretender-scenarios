import { PassthroughCommand, ResponseCommand, ShutdownCommand } from './index';

export type Command =
  | ResponseCommand
  | PassthroughCommand
  | ShutdownCommand;
