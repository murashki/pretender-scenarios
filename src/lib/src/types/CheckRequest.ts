import { ContextRequest } from './';

export type CheckRequest = {
  (request: ContextRequest): boolean;
};
