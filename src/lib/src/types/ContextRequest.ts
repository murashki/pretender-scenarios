export type ContextRequest = {
  method: string;
  headers: { [key in string]: string };
  url: string;
  params: { [key in string]: string };
  queryParams: { [key in string]: string };
  body: undefined | string | any; // В действительности там undefined | string | json
};
