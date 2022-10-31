import { Context, ResponseHandler } from './';

export type ResponseHandlerState = {
  shutdown: boolean;
  responseHandler: ResponseHandler;
  context: Context;
  instance: null | Generator;
};
