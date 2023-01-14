// Run onloadendFixFn right after server creation

export function onloadendFixFn() {
  const FakeXMLHttpRequest = window.XMLHttpRequest;

  window.XMLHttpRequest = function XMLHttpRequest() {
    const request = new FakeXMLHttpRequest();
    delete request.onloadend;
    return request;
  };

  return function restoreFakeXMLHttpRequest() {
    window.XMLHttpRequest = FakeXMLHttpRequest;
  };
}
