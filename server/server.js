const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const port = process.env.PORT || 5000;

const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');
const topicName = "test";

admin.initializeApp({
  //credential: admin.credential.cert(serviceAccount)
});

app.use(express.static(path.join(__dirname, 'build'), {maxAge: "30d"}));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get("/api/hello", (req, res) => {
  sendDelayedResponse(res, { express: "Hello From Express at "+getTimeStamp() + addQuery(req.query) }, 1);
});

app.get("/api/cacheFirst", (req, res) => {
  sendDelayedResponse(res, { express: "cacheFirst at "+getTimeStamp() + addQuery(req.query) }, 2);
});

app.get("/api/networkFirst", (req, res) => {
  sendDelayedResponse(res, { express: "networkFirst at "+getTimeStamp() + addQuery(req.query) }, 3);
});

app.get("/api/cacheOnly", (req, res) => {
  sendDelayedResponse(res, { express: "cacheOnly at "+getTimeStamp() + addQuery(req.query) }, 4);
});

app.get("/api/networkOnly", (req, res) => {
  sendDelayedResponse(res, { express: "networkOnly at "+getTimeStamp() + addQuery(req.query) }, 5);
});

app.get("/api/staleWhileRevalidate", (req, res) => {
  sendDelayedResponse(res, { express: "staleWhileRevalidate at "+getTimeStamp() + addQuery(req.query) }, 6);
});

app.get("/api/networkFirstCacheUpdate", (req, res) => {
  sendDelayedResponse(res, { express: "networkFirstCacheUpdate at "+getTimeStamp() + addQuery(req.query) }, 7)
});


app.get("/api/fallback", (req, res) => {
  sendDelayedResponse(res, { express: "fallback at "+getTimeStamp() + addQuery(req.query) }, 8);
});

app.get("/api/error", (req, res) => {
  throw new Error('my error');
});

app.post("/api/push", (req, res) => {
  sendMessage(req.body.title, req.body.body, req.body.token);
  res.send('POST request to the homepage');
});

app.post("/api/pushTopic", (req, res) => {
  sendMessage(req.body.title, req.body.body, null, topicName);
  res.send('POST request to the homepage');
});

app.post("/api/registerTopic", (req, res) => {
  subscribeTopic(req.body.token, topicName);
  res.send('POST request to the homepage');
});

function getTimeStamp(){
  let date = new Date();
  return date.toLocaleTimeString();
}

function sendDelayedResponse(res, object, delay){
  setTimeout(function() {
    res.send(object);
  }, delay*100);
}

function addQuery(query){
  if(query){
    let text = " ";
    for (let param in query) {
      text = text + param +": "+ query[param]+"; ";
    }
    return text;
  }
}

function sendMessage(title, body, token, topic){
  console.log("sending message");
  let pushMessage = {
    notification : {
      body : body ? body :"This is an FCM notification message!",
      title : title ? title :"FCM Message",
    },
    data: {
      score: '850',
      time: '2:45'
    },
    token,
    topic
  };

  // Send a message to the device corresponding to the provided
// registration token.
  admin.messaging().send(pushMessage)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
};

function subscribeTopic(token, topic){
  // Subscribe the devices corresponding to the registration tokens to the
  // topic.
  admin.messaging().subscribeToTopic([token], topic)
  .then(function(response) {
    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
    console.log('Successfully subscribed to topic:', response);
  })
  .catch(function(error) {
    console.log('Error subscribing to topic:', error);
  });
}
app.listen(port, () => console.log(`Listening on port ${port}`));
