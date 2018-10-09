self.addEventListener("install", function(evt) {
  console.log("The service worker is being installed. ");
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin === location.origin && url.pathname === '/uni/uni.png') {
    //event.respondWith(fetch('/uni/uni_elite.png'));
    event.respondWith(fetch('/uni/uni_is.png'));
  }
});