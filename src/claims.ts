import {
  createServer,
  Context,
  ResponseCommand,
  ResponseData,
} from './lib';

type ServerContext = Exclude<Context, 'response'> & {
  response: <TData extends any = any>(data: TData) => ServerResponseCommand;
};

type ServerResponseCommand = ResponseCommand & {
  status: (status: ResponseData[0]) => ServerResponseCommand;
  headers: (status: ResponseData[1]) => ServerResponseCommand;
};

export const server = createServer<ServerContext>();

const handleContext = server.handleContext;

server.handleContext = function(context) {
  const nextContext = handleContext(context);
  const response = nextContext.response;
  nextContext.response = function<TData extends any = any>(data: TData) {
    const command = response([200, {}, JSON.stringify(data)]) as ServerResponseCommand;
    command.status = function(status: ResponseData[0]): ServerResponseCommand {
      command.payload[0] = status;
      return command;
    };
    command.headers = function(headers: ResponseData[1]): ServerResponseCommand {
      command.payload[1] = headers;
      return command;
    };
    return command;
  };
  return nextContext;
}

type Claim = {
  id: string;
};

type ClaimResponse = {
  claims: Claim[];
};

server.get('/claims/*', function *(ctx) {
  console.log('fakeRequest', ctx.getCurrentRequest());
  yield ctx.response<ClaimResponse>({ claims: [{ id: 'cmd 1' }] });

  // console.log('fakeRequest', ctx.getCurrentRequest());
  yield ctx.response<ClaimResponse>({ claims: [{ id: 'cmd 2' }] });

  yield ctx.shutdown();
});
