const appName = "appname";
const appVersion = "1.5.0";
const STATIC_CACHE = appName + "_STATIC_" + appVersion;
const DYNAMIC_CACHE = appName + "_DYNAMIC_" + appVersion;

self.addEventListener("install", function(evt) {
  console.log("The service worker is being installed. Version " + appVersion);
});

self.addEventListener("activate", function(event) {
  console.log("Clearing old stuff for new version: " + appVersion);
});

self.addEventListener('push', function(event) {
  console.log("push notification recieved", event);
  const data = event.data.json();
  let url = "";
  let icon = "favicon-194x194.png";
  if (typeof data.data !== 'undefined') {
    url = (typeof data.data.url !== 'undefined') ? data.data.url : url;
    icon = (typeof data.data.icon !== 'undefined') ? data.data.icon : icon;
  }
  console.log(icon);
  event.waitUntil(
      self.registration.showNotification(data.notification.title, {
        body: data.notification.body,
        data: {
          url: url
        },
        icon: icon
      })
  );
});
