import React, { Component } from "react";
import { Route, Switch, NavLink } from "react-router-dom";
import Tensor from "./Tensor";
import Home from "./Home";

export default class Root extends Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <main>
          <h1>Welcome to Tensor Paper Scissors!</h1>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/tensor" component={Tensor} />
            {/* <Route exact path="/aircrafts" component={Aircrafts} />
            <Route path="/aircrafts/:aircraftId" component={SingleAircraft} />
            <Route path="/countries/:countryId" component={SingleCountry} /> */}
          </Switch>
        </main>
      </div>
    );
  }
}
