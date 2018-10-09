let callbacks = [];

function registerRefreshCallback(cb) {
  callbacks.push(cb);
}

function unregisterRefreshCallback(removeCb) {
  callbacks = callbacks.filter(cb => cb !== removeCb)
}

function callRefreshCallbacks(data) {
  callbacks.map(cb => cb(data))
}

export { registerRefreshCallback, unregisterRefreshCallback, callRefreshCallbacks }