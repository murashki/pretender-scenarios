import { PretenderServer } from './';

export type PretenderServerRequestMethod =
  | PretenderServer['delete']
  | PretenderServer['get']
  | PretenderServer['head']
  | PretenderServer['options']
  | PretenderServer['patch']
  | PretenderServer['post']
  | PretenderServer['put'];
