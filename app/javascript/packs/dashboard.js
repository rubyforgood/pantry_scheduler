import React from 'react';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appointments: [],
      clients: [],
    };
  }

  componentDidMount() {
    fetch('/api/appointments/today')
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
              <th>Client</th>
              <th>County</th>
              <th>Family Size</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.appointments.map((appointment, index) => {
                const client = this.state.clients.filter(client => (
                  client.id === appointment.client_id
                ))[0];

                return (
                  <tr key={appointment.id}>
                    <td>{client.name}</td>
                    <td>{client.county}</td>
                    <td>{appointment.family_size}</td>
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

const Error = ({ error }) => (
  <div style={{ color: 'red' }}>{error.message}</div>
);
