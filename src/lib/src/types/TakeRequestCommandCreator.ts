import { CheckRequest, TakeRequestCommand } from './';

export type TakeRequestCommandCreator = {
  (payload?: CheckRequest): TakeRequestCommand;
};
