import { ResponseCommand, ResponseData } from './index';

export type ResponseCommandCreator = {
  (payload: ResponseData): ResponseCommand;
};
