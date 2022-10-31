import { PassthroughCommand } from './index';

export type PassthroughCommandCreator = {
  (): PassthroughCommand;
};
