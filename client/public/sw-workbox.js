importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js"
);

const appName = "appname";
const appVersion = "1.5.0";
const STATIC_CACHE = appName + "_STATIC_" + appVersion;
const IMAGE_CACHE = appName + "_IMAGE_" + appVersion;
const DYNAMIC_CACHE = appName + "_DYNAMIC_" + appVersion;

const filesToCache = [
  "/",
  "./",
  "./index.html",
  "./static/js/bundle.js",
  "./static/media/logo.5d5d9eef.svg",
  "./static/media/uni.c4fcd987.png"
];

workbox.precaching.precacheAndRoute(filesToCache);

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: IMAGE_CACHE,
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images
        maxEntries: 100,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60
      })
    ]
  })
);
/*
workbox.routing.registerRoute("/api/hello",
  workbox.strategies.staleWhileRevalidate({
    cacheName: DYNAMIC_CACHE
  })
);
*/

workbox.routing.registerRoute("/api/cacheFirst",
    workbox.strategies.cacheFirst({
      cacheName: DYNAMIC_CACHE
    })
);

workbox.routing.registerRoute("/api/networkFirst",
    workbox.strategies.networkFirst({
      cacheName: DYNAMIC_CACHE
    })
);

workbox.routing.registerRoute("/api/cacheOnly",
    workbox.strategies.cacheOnly({
      cacheName: DYNAMIC_CACHE
    })
);

workbox.routing.registerRoute("/api/networkOnly",
    workbox.strategies.networkOnly({
      cacheName: DYNAMIC_CACHE
    })
);

workbox.routing.registerRoute("/api/staleWhileRevalidate",
    workbox.strategies.staleWhileRevalidate({
      cacheName: DYNAMIC_CACHE
    })
);

workbox.routing.registerRoute("/api/fallback",
    workbox.strategies.staleWhileRevalidate({
      cacheName: DYNAMIC_CACHE
    })
);

workbox.routing.registerRoute("/api/error",
    workbox.strategies.staleWhileRevalidate({
      cacheName: DYNAMIC_CACHE
    })
);

