import { ResponseData } from './';

export type ResponseCommand = {
  type: 'RESPONSE';
  payload: ResponseData | (() => ResponseData);
};
