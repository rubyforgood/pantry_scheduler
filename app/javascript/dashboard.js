import React from 'react';
import {
  toPairs,
  groupBy,
  find,
} from 'lodash';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appointments: [],
      clients: [],
    };
  }

  componentDidMount() {
    fetch(`/api/appointments/${this.props.date || 'today'}`)
      .then(response => response.json())
      .then(json => {
        this.setState({
          appointments: json.appointments || [],
          clients: json.clients || [],
          fetchError: json.error,
        })
      })
      .catch(error => {
        this.setState({ fetchError: error })
      })
  }

  render() {
    return (
      <div>
        <h1>Today</h1>

        {
          this.state.fetchError && (
            <Error error={this.state.fetchError} />
          )
        }

        <table>
          <thead>
            <tr>
              <th>County</th>
              <th>USDA?</th>
              <th>Families</th>
              <th>Counts</th>
            </tr>
          </thead>
          <tbody>
            {
              toPairs(groupBy(this.state.appointments, appt => [
                appt.county, appt.is_usda
              ])).map(([ county, appointments ]) => {
                const clients = appointments.map(appt => (
                  this.state.clients.filter(client => appt.client_id === client.id)[0]
                ));

                return (
                  <tr key={county}>
                    <td>{clients[0].county}</td>
                    <td>{appointments[0].is_usda ? yep() : nope()}</td>
                    <td>{appointments.length}</td>
                    <td>{appointments.map(appt => appt.family_size).join(' / ')}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>

        <h2>Clients</h2>
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>County</th>
            </tr>
          </thead>

          <tbody>
            {
              this.state.appointments.map((appt, index) => {
                const client = find(this.state.clients, c => (
                  c.id === appt.client_id
                ));

                return (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.county}</td>
                    <td>{appt.family_size}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}


const yep = () => <span>&#10004;</span>;
const nope = () => <span>&times;</span>;

const Error = ({ error }) => (
  <div style={{ color: 'red' }}>{error.message}</div>
);
