import React, { Component } from "react";
import PropTypes from "prop-types";
import { registerRefreshCallback, unregisterRefreshCallback } from "./refresh";
import callApi from "./api";

class ServerData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: "loading",
      spinner: "loading",
      changed: undefined
    };
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.getData();
    registerRefreshCallback(this.refresh);
  }

  componentWillUnmount() {
    unregisterRefreshCallback(this.refresh);
  }
  refresh(){
    this.setState({spinner: "loading"}, this.getData);
  }
  getData() {
    callApi(this.props.url)
      .then(res =>
        this.setState(
          prevState =>
            prevState.response !== res.express
              ? { response: res.express, changed: true, spinner: "finished" }
              : { changed: false, spinner: "finished" }
        )
      )
      .catch(err => {
        console.log(err);
        this.setState({
          response: this.props.url + " error",
          spinner: "finished"
        });
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
    return null
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

ServerData.propTypes = {
  url: PropTypes.string.isRequired
};

export default ServerData;
