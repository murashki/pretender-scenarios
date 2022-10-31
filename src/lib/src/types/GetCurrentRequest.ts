import { FakeRequest } from './index';

export type GetCurrentRequest = {
  (): FakeRequest;
};
