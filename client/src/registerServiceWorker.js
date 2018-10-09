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
    .register(swUrl)
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
