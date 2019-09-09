export default function register() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      //Exercise 8 - WorkBox
      //const swUrl = `${process.env.PUBLIC_URL}/sw-workbox.js`;
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;
      registerValidSW(swUrl);
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl, {updateViaCache: 'all'}) //https://developers.google.com/web/updates/2018/06/fresher-sw
    .then(registration => {
      console.log("service worker registered");
    })
    .catch(error => {
      console.error("Error during service worker registration:", error);
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
