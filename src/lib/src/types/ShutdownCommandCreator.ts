import { ShutdownCommand } from './index';

export type ShutdownCommandCreator = {
  (): ShutdownCommand;
};
