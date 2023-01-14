import { ResponseHandlerKey, ResponseHandlerLink } from './';

export type ResponseHandlerBank = {
  [key in ResponseHandlerKey]: ResponseHandlerLink;
};
