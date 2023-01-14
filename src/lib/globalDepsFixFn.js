// Run it before pretender package import

export function globalDepsFixFn() {
  window.FakeXMLHttpRequest = require('fake-xml-http-request');
  window.RouteRecognizer = require('route-recognizer');
}
