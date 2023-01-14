import { BaseContext, Context, ResponseHandler } from './';

export type RequestHandler<TContext extends BaseContext = Context> = {
  (urlExpression: string, response: ResponseHandler<TContext>): void;
};
