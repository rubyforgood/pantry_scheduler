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
import CheckIn from 'appointment-check-in';
import ClientForm from 'client-form';
import NewAppointment from 'new-appointment';
import NewClient from 'new-client';

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
        <div style={Style.app}>
          <nav style={Style.navBar}>
            <NavLink to="/" style={Style.navLink}>Dashboard</NavLink>
            <NavLink to="/directory" style={Style.navLink}> Directory</NavLink>
            <NavLink to="/new_appointment" style={Style.navLink}>New Appointment</NavLink>
            <NavLink to="/new_client" style={Style.navLink}>New Client</NavLink>
          </nav>
          <div style={Style.routeContainer}>
            <Route
              exact
              path="/"
              render={() => <Dashboard date={this.state.selectedDate} />}
            />
            <Route path="/directory" component={Directory} />
            <Route path="/new_appointment" component={NewAppointment} />
            <Route path="/new_client" component={NewClient} />
            { /* FIXME: route below isn't used */ }
            <Route
              path="/appointments/:id/check_in"
              component={CheckIn}
            />
          </div>
        </div>
      </Router>
    );
  }
}

class NavLink extends React.Component {
  render() {
    return (
      <span style={Style.link}>
        <Link {...this.props} />
      </span>
    );
  }
}

const Style = {
  app: {
    fontFamily: 'sans-serif',
    width: '800px',
    maxWidth: '80%',
    margin: '0 auto',
    padding: '1em 2em',
    minHeight: '90vh',
  },
  navBar: {
    backgroundColor: '#E5E5E5',
    position: 'absolute',
    top: 0,
    left: 0,
    minWidth: '100%',
    padding: 10,
  },
  navLink: {
    textDecoration: 'none',
    color: '#696969',
    fontWeight: 'bold',
    padding: 30,
  },
  link: {
    display: 'inline-block',
    padding: '1em',
  },
  routeContainer: {
    marginTop: 70,
  }
};

if(document.getElementById('app')) {
  requestAnimationFrame(() => {
    ReactDOM.render(<App />, document.getElementById('app'));
  });
}
