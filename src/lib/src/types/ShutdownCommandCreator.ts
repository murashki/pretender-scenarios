import { ShutdownCommand } from './';

export type ShutdownCommandCreator = {
  (): ShutdownCommand;
};
