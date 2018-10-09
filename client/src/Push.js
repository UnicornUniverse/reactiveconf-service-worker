import React, { Component } from "react";
import FirebaseApp from "firebase/app";
import "firebase/messaging";

class Push extends Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element

    this.state = {
      token: ""
    };

    this.title = React.createRef();
    this.message = React.createRef();
  }


  componentDidMount() {
    this._initFireBase();
    this._initServiceWorker();
  }

  _initFireBase() {
    let config = {
      apiKey: "AIzaSyBQGjBv8-eXDMBh-ol6Cs6IK00uSeAToqU",
      projectId: "reactiveconf-d8d2c",
      messagingSenderId: "756277296885"
    };

    if (!FirebaseApp.apps.length) {
      FirebaseApp.initializeApp(config);
    }
  }

  _initServiceWorker() {
    let messaging = FirebaseApp.messaging();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then(registration => {
          if (!messaging.registrationToUse) {
            messaging.useServiceWorker(registration);
          }

          messaging.onTokenRefresh(() => {
            messaging
              .getToken()
              .then(token => this._setToken(token))
              .catch(function(err) {
                console.log("Unable to retrieve refreshed token ", err);
              });
          });

          //request permission for Push Message.
          messaging
            .requestPermission()
            .then(() => {
              messaging.getToken().then(token => this._setToken(token));
            })
            .catch(function(err) {
              console.log("Push Message is disallowed", err);
            });
        })
        .catch(function(err) {
          console.log("Service Worker registration failed: ", err);
        });
    }
  }

  _setToken(currentToken) {
    this.setState({ token: currentToken });
  }

  pushMessage(token) {
    let body = this.message.current.value;
    let title = this.title.current.value;
    fetch("/api/push/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ token, title, body })
    })
      .then(function(res) {
        console.log(res);
      })
      .catch(function(res) {
        console.log(res);
      });
  }

  pushMessageToTopic(token) {
    let body = this.message.current.value;
    let title = this.title.current.value;
    fetch("/api/pushTopic/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ token, title, body })
    })
    .then(function(res) {
      console.log(res);
    })
    .catch(function(res) {
      console.log(res);
    });
  }

  registerToTopic(token) {
    fetch("/api/registerTopic/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ token })
    })
    .then(function(res) {
      console.log(res);
    })
    .catch(function(res) {
      console.log(res);
    });
  }

  render() {
    return (
      <div>
        <p> Your token: {this.state.token} </p>
        <label htmlFor="titleId">Title</label> <input name="title" id="titleId" ref={this.title} type="text"/>
        <label htmlFor="messageId">Message</label> <input name="message" id="messageId" ref={this.message} type="text"/><br />
        <button onClick={()=>this.pushMessage(this.state.token)}> PUSH MESSAGE TO ME </button><br />
        <button onClick={()=>this.pushMessageToTopic(this.state.token)}> PUSH MESSAGE TO TOPIC </button>
        <button onClick={()=>this.registerToTopic(this.state.token)}> REGISTER TO TOPIC </button>

      </div>
    );
  }
}

export default Push;
