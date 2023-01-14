import { PassthroughCommand, ResponseCommand, ShutdownCommand, TakeRequestCommand } from './';

export type Command = ResponseCommand | PassthroughCommand | ShutdownCommand | TakeRequestCommand;
