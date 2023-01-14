import { ResponseCommand, ResponseData } from './';

export type ResponseCommandCreator = {
  (payload: ResponseData | (() => ResponseData)): ResponseCommand;
};
