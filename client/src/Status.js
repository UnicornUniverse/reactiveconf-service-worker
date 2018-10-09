import React, { Component } from "react";

class Status extends Component {
  state = {
    status: this.getOnlineStatus(),
    speed: this.getConnectionInfo().downlink,
    effectiveType: this.getConnectionInfo().effectiveType,
    rtt: this.getConnectionInfo().rtt,
    type: this.getConnectionInfo().type
  };
  constructor(props){
    super(props);
    this.updateOnlineStatus = this.updateOnlineStatus.bind(this);
    this.updateOnlineSpeed = this.updateOnlineSpeed.bind(this);
  }

  componentDidMount() {
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
    let connection = this.getConnection();
    if (connection) {
      connection.onchange = this.updateOnlineSpeed;
    }
  }

  componentWillUnmount() {
    window.removeEventListener("online", this.updateOnlineStatus);
    window.removeEventListener("offline", this.updateOnlineStatus);
    let connection = this.getConnection();
    if (connection) {
      connection.onchange = null;
    }
  }

  getConnection() {
    return (
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection ||
      {}
    );
  }
  getOnlineStatus() {
    return navigator.onLine ? "online" : "offline";
  }
  updateOnlineStatus() {
    let status = this.getOnlineStatus();
    this.setState({ status: status });
  }
  getConnectionInfo() {
    let connection = this.getConnection();
    console.log("connection", connection);
    if (connection) {
      return connection;
    }
  }
  updateOnlineSpeed() {
    let connection = this.getConnectionInfo();
    this.setState({
      speed: connection.downlink,
      effectiveType: connection.effectiveType,
      rtt: connection.rtt,
      type: connection.type

    });
  }

  render() {
    return (
      <div>
        <p>Your application is currently <strong>{this.state.status}</strong></p>
        <p>Your internet speed is about  <strong>{this.state.speed}</strong> Mb/s</p>
        <p>Your internet effectiveType is  <strong>{this.state.effectiveType}</strong></p>
        <p>Your internet rtt is about  <strong>{this.state.rtt}</strong> ms</p>
        <p>Your internet type is <strong>{this.state.type}</strong></p>
      </div>
    );
  }
}

export default Status;
