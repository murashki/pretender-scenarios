const NativeXMLHttpRequest = window.XMLHttpRequest;

window.XMLHttpRequest = function XMLHttpRequest() {
  const request = new NativeXMLHttpRequest(arguments);
  delete request.onloadend;
  return request;
};
