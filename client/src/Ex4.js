import React, { Component } from "react";
import "./App.css";
import Status from "./Status.js";
import ServerData from "./ServerData";
import ServerDataWithUpdate from "./ServerDataWithUpdate";
import {callRefreshCallbacks} from "./refresh"

class Ex4 extends Component {
  render() {
    return (
      <div>

        <ServerData url={"/api/hello"} />

        <ServerData url={"/api/cacheFirst"} />
        <ServerData url={"/api/cacheFirst?someQuery=test2"} />
        <ServerData url={"/api/networkFirst"} />
        <ServerData url={"/api/cacheOnly"} />
        <ServerData url={"/api/networkOnly"} />
        <ServerData url={"/api/staleWhileRevalidate"} />

        <ServerDataWithUpdate url={"/api/networkFirstCacheUpdate"} />

        <Status />
        <button onClick={callRefreshCallbacks}> Fetch </button>

      </div>
    );
  }
}

export default Ex4;
