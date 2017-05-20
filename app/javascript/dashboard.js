import React from 'react';
import {
  toPairs,
  groupBy,
  find,
  sortBy,
} from 'lodash';
import { Link } from 'react-router-dom';
import Modal from 'modal';

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

        <AppointmentFilterList
          appointments={this.state.appointments}
          clients={this.state.clients}
          onChange={(filter) => this.setState({ apptFilter: filter })}
        />

        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>County</th>
              <th>Family Size</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {
              this.filteredAppointments().map((appt, index) => {
                const client = find(this.state.clients, c => (
                  c.id === appt.client_id
                ));
                const notes = this.state.notes.filter(note => (
                  note.memoable_type === 'Appointment' && note.memoable_id === appt.id
                ))

                return (
                  <tr key={client.id}>
                    <td>{client.first_name} {client.last_name}</td>
                    <td>{client.county}</td>
                    <td>{appt.family_size}</td>
                    <td>
                      <button onClick={() => this.showNotes(appt.id)}>
                        {notes.length > 0 ? notes.length : ''} Note{notes.length === 1 ? '' : 's'}
                      </button>
                    </td>
                    <td>
                      <Link to={`/appointments/${appt.id}/check_in`}>
                        Check In
                      </Link>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>

        {this.modal()}
      </div>
    );
  }

  filteredAppointments() {
    const filter = this.state.apptFilter;
    if(!filter) { return this.state.appointments; }


    const filtered = this.state.appointments.filter(appt => {
      const client = find(this.state.clients, c => (
        c.id === appt.client_id
      ));

      var key;
      for(var keys = Object.keys(filter), i = 0; i < keys.length; i++) {
        key = keys[i];
        if((client[key] || appt[key]) !== filter[key]) return false;
      }

      return true;
    });

    return filtered;
  }

  showNotes(apptId) {
    this.setState({
      apptNotes: apptId,
    });
  }

  modal() {
    if(this.state.apptNotes) {
      return (
        <Modal onClose={() => this.showNotes(null)}>
          {
            this.state.notes.filter((note) => (
              note.memoable_type === 'Appointment' && note.memoable_id === this.state.apptNotes
            )).map(note => (
              <div key={note.id}>
                <p>{note.body}</p>
              </div>
            ))
          }
        </Modal>
      );
    }
  }
}

class AppointmentFilterList extends React.Component {
  render() {
    return (
      <div style={Style.appointmentFilterList}>
        {
          sortBy(toPairs(groupBy(this.props.appointments, appt => {
            const client = this.props.clients.filter(client => (
              appt.client_id === client.id
            ))[0];
            return `${client.county}${appt.usda_qualifier ? '-USDA' : ''}`;
          })), (([label, appointments]) => label))
          .map(([label, appointments]) => {
            const client = this.props.clients.filter(client => (
              appointments[0].client_id === client.id
            ))[0];

            return (
              <button
                key={label}
                style={Style.appointmentFilter}
                onClick={() => {
                  const appointmentFilter = this.state || {};

                  if(appointmentFilter.county !== client.county ||
                     appointmentFilter.usda_qualifier !== client.usda_qualifier
                  ) {
                    this.setState({
                      county: client.county,
                      usda_qualifier: appointments[0].usda_qualifier,
                    });
                    this.props.onChange({
                      county: client.county,
                      usda_qualifier: appointments[0].usda_qualifier,
                    });
                  } else {
                    this.setState({
                      county: null,
                      usda_qualifier: null,
                    });
                    this.props.onChange(null);
                  }
                }}
              >
                <span style={Style.filterLabel}>{label}</span>
                <span style={Style.filterCount}>{appointments.length}</span>
              </button>
            );
          })
        }
      </div>
    );
  }
}

const yep = () => <span>&#10004;</span>;
const nope = () => <span>&times;</span>;

const Error = ({ error }) => (
  <div style={{ color: 'red' }}>{error.message}</div>
);

const Style = {
  appointmentFilterList: {
    listStyle: 'none',
    padding: 0,
  },
  appointmentFilter: {
    display: 'inline-block',
    verticalAlign: 'top',
    padding: '0.5em',
    margin: '0.5em',
  },
  filterLabel: {
    
  },
  filterCount: {
    display: 'inline-block',
    marginLeft: '12px',
    width: '16px',
    height: '16px',
    textAlign: 'center',
    borderRadius: '50%',
    backgroundColor: '#ccc',
  },
};
