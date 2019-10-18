# Demo app for Service Workers

Application is intended as demo or example for Service Workers. It is mainly created for [ReactiveConf](https://reactiveconf.com/). 
User can try ServiceWorker initialization, caching strategies and push notifications via [FCM](https://firebase.google.com/docs/cloud-messaging/).

Whole application is created using [create-react-app](https://github.com/facebook/create-react-app) with small changes, so everyone using react should be able to understand basic concepts.
# How to run
## Initialization
1. `npm install`
1. `cd client`
1. `npm install`
1. `cd ..`

## Main way of running example
1. `npm run dev`

It will start server on port 5000 and client on port 3000. All requests for data are handled trough webpack proxy to server part. You can try your application on page <http://localhost:3000> }. It should start on its own, after running application.

## Running minified build
1. `cd client`
1. `npm build`
1. `cd ..`
1. `npm run server`

It will start only server part. You can try your application on page <http://localhost:5000>

# Push notification
For push notification you need your own serviceAccountKey. In this example it is intentionally broken.
You need to just update file "server/serviceAccountKey.json" with correct information. Registering at FireBase is free and push notifications are free as well. 