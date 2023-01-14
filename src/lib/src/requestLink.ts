import { RequestLinkStatus } from './types';

export class RequestLink extends Error {
  requestLink: true;
  status: RequestLinkStatus;

  constructor(status: RequestLinkStatus) {
    super('Request link');
    this.requestLink = true;
    this.status = status;
  }
}

export function isRequestLink(value: any): value is RequestLink {
  return value instanceof RequestLink;
}

export function checkRequestLink(value: any, requestLinkStatus: RequestLinkStatus): boolean {
  return isRequestLink(value) && value.status === requestLinkStatus;
}
