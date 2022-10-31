import { ResponseHandler } from 'pretender';

export type FakeRequest = Parameters<ResponseHandler>[0];
