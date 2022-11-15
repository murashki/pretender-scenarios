const NativeXMLHttpRequest = window.XMLHttpRequest;

window.XMLHttpRequest = function XMLHttpRequest() {
  const request = new NativeXMLHttpRequest();
  delete request.onloadend;
  return request;
};
