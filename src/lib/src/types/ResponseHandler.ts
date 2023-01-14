import { BaseContext, Context } from './';

export type ResponseHandler<TContext extends BaseContext = Context> = {
  (context: TContext): Generator<any, any, any>;
};
