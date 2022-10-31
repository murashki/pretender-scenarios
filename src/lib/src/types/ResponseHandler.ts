import { BaseContext, Context } from './index';

export type ResponseHandler<TContext extends BaseContext = Context> = {
  (context: TContext): Generator;
};
