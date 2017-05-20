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
      notes: [],
    };
  }

  componentDidMount() {
    fetch(`/api/appointments/${this.props.date || 'today'}`)
      .then(response => response.json())
      .then(json => {
        this.setState({
          appointments: json.appointments || [],
          clients: json.clients || [],
          notes: json.notes || [],
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
                    <td>
                      {
                        find(this.state.notes, note => (
                          note.memoable_type === 'Appointment' && note.memoable_id === appt.id
                        )) && (
                          <button onClick={() => this.showNotes(appt.id)}>
                            Notes
                          </button>
                        )
                      }
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>

        { this.state.apptNotes && (
          <div style={Style.modalOverlay} onClick={() => this.showNotes(null)}>
            <div style={Style.modal} onClick={event => event.stopPropagation()}>
              <button onClick={() => this.showNotes(null)}>&times;</button>
              {
                this.state.notes.filter((note) => (
                  note.memoable_type === 'Appointment' && note.memoable_id === this.state.apptNotes
                )).map(note => (
                  <div key={note.id}>
                    <p>{note.body}</p>
                  </div>
                ))
              }
            </div>
          </div>
        ) }
      </div>
    );
  }

  showNotes(apptId) {
    this.setState({
      apptNotes: apptId,
    });
  }
}


const yep = () => <span>&#10004;</span>;
const nope = () => <span>&times;</span>;

const Error = ({ error }) => (
  <div style={{ color: 'red' }}>{error.message}</div>
);

const Style = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  modal: {
    width: '50%',
    backgroundColor: 'white',
    margin: '20vh auto',
    padding: '2em',
  },
};
