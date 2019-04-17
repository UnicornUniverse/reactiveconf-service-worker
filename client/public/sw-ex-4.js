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

  switch (getCacheMethod(requestURL)) {
    case "cacheFirst":
      cacheFirstPopulate(event);
      break;
    case "networkFirst":
      networkFistCacheUpdate(event);
      break;
    case "cacheOnly":
      cacheOnly(event);
      break;
    case "networkOnly":
      networOnly(event);
      break;
    case "staleWhileRevalidate":
      staleWhileRevalidate(event);
      break;
    case "networkFirstCacheUpdate":
      networkFistCacheUpdate(event);
      break;
    default:
      cacheFirst(event);
  }
});

function getCacheMethod(url) {
  if (url.pathname.includes("api")) {
    return url.pathname.substring(5);
  }
  return "default";
}

function cacheOnly(event) {
  event.respondWith(caches.match(event.request));
}

function networOnly(event) {
  event.respondWith(fetch(event.request));
}

function cacheFirst(event) {
  event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
  );
}

function cacheFirstPopulate(event) {
  event.respondWith(
      caches.match(event.request).then(function(response) {
        return (
            response ||
            caches.open(DYNAMIC_CACHE).then(function(cache) {
              return fetch(event.request).then(function(response) {
                cache.put(event.request, response.clone());
                return response;
              });
            })
        );
      })
  );
}

function networkFirst(event) {
  event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request);
      })
  );
}

function networkFistCacheUpdate(event) {
  event.respondWith(
      caches.open(DYNAMIC_CACHE).then(function(cache) {
        return fetch(event.request)
        .then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(function(e) {
          return cache.match(event.request).then(function(response) {
            return response || fetch(event.request);
          });
        });
      })
  );
}

function staleWhileRevalidate(event) {
  event.respondWith(
      caches.open(DYNAMIC_CACHE).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          var fetchPromise = fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
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

