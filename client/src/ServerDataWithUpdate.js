import React, { Component } from "react";
import PropTypes from "prop-types";
import callApi from "./api";
import { registerRefreshCallback, unregisterRefreshCallback } from "./refresh";

class ServerDataWithUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: "loading",
      networkDataReceived: false,
      spinner: "loading",
      changed: undefined
    };
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getDataOnLoad();
    registerRefreshCallback(this.getData);
  }

  componentWillUnmount() {
    unregisterRefreshCallback(this.getData);
  }

  getData() {
    this.setState(
      {
        response: "loading",
        networkDataReceived: false,
        spinner: "loading"
      },
      this.getDataOnLoad
    );
  }

  async getDataOnLoad() {
    this.networkUpdate();

    // fetch cached data
    let response = await caches.match(this.props.url);

    if (response) {
      let data = await response.json();
      // don't overwrite newer network data
      console.log("ServerDataWithUpdate updatePage 2", data);
      this.setState(
        prevState =>
          prevState.networkDataReceived
            ? null
            : {
                response: data.express,
                changed: ServerDataWithUpdate.getStateChanged(data.express, prevState),
                spinner: "loaded from cache"
              }
      );
    }
  }

  static getStateChanged(response, prevState) {
    return prevState.response !== response;

  }

  networkUpdate() {
    callApi(this.props.url)
      .then(data => {
        console.log("ServerDataWithUpdate data from server");
        this.setState(prevState => {
          return {
            response: data.express,
            changed: ServerDataWithUpdate.getStateChanged(data.express, prevState),
            networkDataReceived: true,
            spinner: "finished"
          };
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  getStyle() {
    if (this.state.changed) {
      return {
        color: "red"
      };
    }

    return {
      color: "blue"
    };
  }
  renderLoader() {
    if (this.state.spinner === "loading") {
      return <div className="loader" />;
    }
    if (this.state.spinner === "loaded from cache") {
      return <div className="loader2" />;
    }
    return null;
  }
  render() {
    return (
      <div>
        <span className="App-intro" style={this.getStyle()}>
          {this.state.response}
        </span>
        {this.renderLoader()}
      </div>
    );
  }
}

ServerDataWithUpdate.propTypes = {
  url: PropTypes.string.isRequired
};

export default ServerDataWithUpdate;
