const appName = "appname";
const appVersion = "1.5.0";
const STATIC_CACHE = appName + "_STATIC_" + appVersion;
const DYNAMIC_CACHE = appName + "_DYNAMIC_" + appVersion;

const filesToCachePriority = [
  "", //root for the cache - so the page will load even offline
  "/",
  "./index.html",
  "./manifest.json",
  "./static/js/bundle.js"
];

const filesToCache = [
  "./logo.svg",
  "./uni/uni.png",
  "./uni/uni_elite.png",
  "./uni/uni_is.png",
  "./avatars/missing.svg",
  "./avatars/offline.svg",
  "./favicon-194x194.png"
];

self.addEventListener("install", function(evt) {
  console.log("The service worker is being installed. Version " + appVersion);
  evt.waitUntil(precache());
});

self.addEventListener("activate", function(event) {
  console.log("Clearing old stuff for new version: " + appVersion);

  event.waitUntil(caches.keys().then(clearOldCaches));
});

self.addEventListener("fetch", function(event) {
  var requestURL = new URL(event.request.url);
  if (requestURL.pathname.includes("avatars")) {
    cacheNetworkFallback(event, "/avatars/missing.svg", "/avatars/offline.svg");
  }else{
    cacheFirst(event);
  }

});

function cacheFirst(event) {
  event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
  );
}

function cacheNetworkFallback(event, fallbackUri, offlineUri) {
  event.respondWith(
      caches.match(event.request).then(function(response) {
        return (
            response ||
            fetch(event.request)
            .then(function(response) {
              // Check if we received a valid response
              if (!response || response.status !== 200 || response.type !== "basic"
              ) {
                return caches.match(fallbackUri);
              } else {
                return response;
              }
            })
            .catch(function() {
              return caches.match(offlineUri);
            })
        );
      })
  );
}

function precache() {
  return caches.open(STATIC_CACHE).then(function(cache) {
    console.log("Precaching..." + STATIC_CACHE);
    //stuff that can be loaded later and is not especially important - we are not waiting for this to startup a page
    cache.addAll(filesToCache);
    //important stuff, which is necessary to page loading and working - we are waiting for that
    return cache.addAll(filesToCachePriority);
  });
}

function clearOldCaches(cacheNames) {
  return Promise.all(cacheNames.filter(filterOldCaches).map(deleteCache));
}

function filterOldCaches(cacheName) {
  return cacheName.startsWith(appName) && !cacheName.endsWith(appVersion);
}

function deleteCache(cacheName) {
  console.log("removing old cache: " + cacheName);
  return caches.delete(cacheName);
}

