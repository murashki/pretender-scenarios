import {
  GetCurrentRequest,
  PassthroughCommandCreator,
  ResponseCommandCreator,
  ShutdownCommandCreator,
  TakeRequestCommandCreator,
} from './';

export type Context = {
  getCurrentRequest: GetCurrentRequest;

  // TODO
  // Команды можно вынести из контекста
  response: ResponseCommandCreator;
  passthrough: PassthroughCommandCreator;
  shutdown: ShutdownCommandCreator;
  takeRequest: TakeRequestCommandCreator;
};
