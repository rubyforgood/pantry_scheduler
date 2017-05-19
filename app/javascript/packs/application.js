import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import Dashboard from './dashboard';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: {},
      signingIn: true,
    };
  }

  componentDidMount() {
    fetch('/api/session')
      .then(response => response.json())
      .then(({ session, error }) => {
        this.setState({
          session: session || {},
          authError: error,
          signedIn: !!session,
          signingIn: false,
        });
      })
      .catch((error) => {
        this.setState({
          authError: error,
          signedIn: false,
          signingIn: false,
        });
      })
  }

  render() {
    const {
      session,
      authError,
      signingIn,
    } = this.state;

    return (
      <Router>
        <div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>

          { authError && (
            <div style={{ color: 'red' }}>
              {authError.message}
            </div>
          ) }

          { session.user && (
            <div>Logged in as {session.user.name}</div>
          ) }

          { signingIn ? (
            <div>Loading&hellip;</div>
          ) : (
            session.user ? (
              <div>
                <Route exact path="/" component={Home} />
                <Route path="/dashboard" component={Dashboard} />
              </div>
            ) : (
              <Redirect to="/login" />
            )
          ) }
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

ReactDOM.render(<App />, document.getElementById('app'));
