import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import Dashboard from 'dashboard';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: null,
    };
  }

  render() {
    return (
      <Router>
        <div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>

          <Route exact path="/" component={Home} />
          <Route
            path="/dashboard"
            render={() => <Dashboard date={this.state.selectedDate} />}
          />
        </div>
      </Router>
    );
  }
}

const Home = () => (
  <div>
    Home
  </div>
);

if(document.getElementById('app')) {
  requestAnimationFrame(() => {
    ReactDOM.render(<App />, document.getElementById('app'));
  });
}
