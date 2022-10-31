import { ResponseData } from './index';

export type ResponseCommand = {
  type: 'RESPONSE';
  payload: ResponseData;
};
