import type { ResponseHandler } from 'pretender';

export type FakeRequest = Parameters<ResponseHandler>[0] & {
  passthrough: () => void;
  method: string;
  url: string;
  params: { [key in string]: string };
  body: undefined | string;
  responseHeaders: { [key in string]: string };
};
