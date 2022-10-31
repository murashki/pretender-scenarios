import './claims';

console.clear();
console.log("***RUN***");

setTimeout(() => {
  console.log("fetch /claims/1");
  fetch("/claims/1").then(response => console.log("response /claims/1", response));

  console.log("fetch /claims/2");
  fetch("/claims/2").then(response => console.log("response /claims/2", response));

  console.log("fetch /claims/3");
  fetch("/claims/3").then(response => console.log("response /claims/3", response));

  console.log("fetch /abc");
  fetch("/abc").then(response => console.log("response /abc", response));
}, 1000);
