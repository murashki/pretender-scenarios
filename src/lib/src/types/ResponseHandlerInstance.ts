import { CheckRequest, ResponseHandler, ResponseHandlerKey } from './';

export type ResponseHandlerInstance = {
  handler: ResponseHandler;
  handlerKey: ResponseHandlerKey;
  used: boolean;
  generatorInstance: null | Generator;
  nextValue: any;
  await: null | CheckRequest;
  shutdown: boolean;
};
