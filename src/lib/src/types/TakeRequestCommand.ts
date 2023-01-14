import { CheckRequest } from './';

export type TakeRequestCommand = {
  type: 'TAKE_REQUEST';
  payload?: CheckRequest;
};
