import { PassthroughCommand } from './';

export type PassthroughCommandCreator = {
  (): PassthroughCommand;
};
