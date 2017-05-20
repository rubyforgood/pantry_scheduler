import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import Dashboard from 'dashboard';
import Directory from 'directory';

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
            <Link to="/directory">Directory</Link>
          </nav>
          <Route exact path="/" component={Home} />
          <Route
            path="/dashboard"
            render={() => <Dashboard date={this.state.selectedDate} />}
          />
          <Route path="/directory" component={Directory} />
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
