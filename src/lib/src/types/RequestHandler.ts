import { BaseContext, Context, ResponseHandler } from './index';

export type RequestHandler<TContext extends BaseContext = Context> = {
  (
    urlExpression: string,
    response: ResponseHandler<TContext>,
  ): void;
};
