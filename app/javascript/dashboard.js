import React from 'react';
import {
  toPairs,
  groupBy,
  find,
  sortBy,
} from 'lodash';
import { Link } from 'react-router-dom';
import Modal from 'modal';
import ClientForm from 'client-form';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appointments: [],
      currentCheckIn: null,
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

        <table style={Style.appointmentTable}>
          <thead>
            <tr style={Style.appointmentTableHeader}>
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
                  note.memoable_type === 'Client' && note.memoable_id === appt.client_id
                ))

                return (
                  <tr key={appt.id} style={Style.appointmentTableRow(index)}>
                    <td style={Style.appointmentTableCell}>{client.first_name} {client.last_name}</td>
                    <td style={Style.appointmentTableCellCentered}>{client.county}</td>
                    <td style={Style.appointmentTableCellCentered}>{client.num_adults + client.num_children}</td>
                    <td style={Style.appointmentTableCellCentered}>
                      <button
                        onClick={() => this.showNotes(appt.client_id)}
                        style={{ display: 'inline-block', width: '100%' }}
                      >
                        {notes.length > 0 ? notes.length : ''} Note{notes.length === 1 ? '' : 's'}
                      </button>
                    </td>
                    <td style={Style.appointmentTableCellCentered}>
                      { appt.checked_in_at || (
                        <button onClick={() => this.setState({ currentCheckIn: {client: client, appointment: appt } })}>
                          Check In
                        </button>
                      ) }
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>

        {this.modal()}
        {this.checkinModal()}
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

  showNotes(clientId) {
    this.setState({
      clientNotesId: clientId,
    });
  }

  updateClient(client) {
    const index = _.findIndex(this.state.clients, ["id", client.id]);
    this.state.clients.splice(index, 1, client)
    this.setState({
      clients: this.state.clients,
    })
  }

  checkIn(appointment) {
    const index = _.findIndex(this.state.appointments, ["id", appointment.id]);
    this.state.appointments.splice(index, 1, appointment)
    this.setState({
      appointments: this.state.appointments,
      currentCheckIn: null,
    })
  }

  modal() {
    if(this.state.clientNotesId) {
      return (
        <Modal onClose={() => this.showNotes(null)}>
          <div>
            {
              this.state.notes.filter((note) => (
                note.memoable_type === 'Client' && note.memoable_id === this.state.clientNotesId
              )).map(note => (
                <div key={note.id} style={Style.note}>
                  <p>{note.body}</p>
                  <cite>{note.author.email}</cite>
                  <button
                    style={Style.deleteNoteButton}
                    onClick={() => {
                      fetch(`/api/clients/${this.state.clientNotesId}/notes/${note.id}`, {
                        method: 'DELETE',
                        credentials: 'include',
                      }).then(() => {
                        this.setState({
                          notes: this.state.notes.filter(n => note.id !== n.id)
                        })
                      })
                    }}
                  >
                    <img
                      height='16'
                      width='16'
                      src='https://cdn3.iconfinder.com/data/icons/linecons-free-vector-icons-pack/32/trash-512.png'
                    />
                  </button>
                </div>
              ))
            }
            <NewNote
              key="new-note"
              clientId={this.state.clientNotesId}
              onSave={({ note }) => {
                this.setState({
                  notes: this.state.notes.concat(note),
                })
              }}
            />
          </div>
        </Modal>
      );
    }
  }

  checkinModal() {
    if (this.state.currentCheckIn) {
      return (
        <Modal onClose={() => this.setState({currentCheckIn: null})}>
          <ClientForm
            client={this.state.currentCheckIn.client}
            appointment={this.state.currentCheckIn.appointment}
            onSave={this.updateClient.bind(this)}
            onCheckIn={this.checkIn.bind(this)}
          />
        </Modal>
      );
    }
  }
}

class NewNote extends React.Component {
  constructor(props) {
   super(props);

   this.state = {
     saving: false,
   };
  }

  render() {
    return (
      <form
        onSubmit={(event) => {
          this.setState({ saving: true });
          this.save(event)
            .then(() => this.setState({ saving: false }))
            .then(() => this.textarea.value = null)
        }}
      >
        <div>
          <textarea
            ref={(element) => this.textarea = element}
            disabled={this.state.saving}
            style={Style.newNoteField}
          />
        </div>
        <div>
          <button disabled={this.state.saving} style={Style.button}>Save</button>
        </div>
      </form>
    );
  }

  save(event) {
    event.preventDefault();

    return fetch(`/api/clients/${this.props.clientId}/notes`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        note: {
          body: this.textarea.value,
        },
      }),
    })
      .then(response => response.json())
      .then(json => this.props.onSave(json))
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

// FIXME: currently unused
class CheckInLink extends React.Component {
  render() {
    return (
      <Link
        to={`/appointments/${this.props.appointment.id}/check_in`}
        style={Style.checkInLink}
      >
        Check In
      </Link>
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
    border: '1px solid #aaa',
    backgroundColor: 'white',
    borderRadius: '16px',
    display: 'inline-block',
    verticalAlign: 'top',
    padding: '0.5em',
    margin: '0.5em',
    outline: 'none',
  },
  appointmentTable: {
    width: '100%',
  },
  appointmentTableHeader: {
  },
  appointmentTableRow(row) {
    return Object.assign({}, this.appointmentTableHeader, {
      backgroundColor: row % 2 === 0 ? '#ccc' : '#ddd',
    });
  },
  appointmentTableCell: {
    margin: '-2px',
    padding: '4px',
  },
  appointmentTableCellCentered: {
    textAlign: 'center',
    margin: '-2px',
    padding: '4px',
  },
  button: {
    marginTop: 10,
    padding: 10,
  },
  checkInLink: {
    display: 'inline-block',
    fontVariant: 'all-small-caps',
    textDecoration: 'none',
    backgroundColor: 'white',
    color: '#333',
    padding: '3px 12px',
    border: '1px solid #888',
  },
  filterLabel: {
    display: 'inline-block',
    paddingLeft: '1em',
  },
  filterCount: {
    display: 'inline-block',
    paddingTop: '1px',
    marginLeft: '12px',
    width: '16px',
    height: '16px',
    textAlign: 'center',
    borderRadius: '50%',
    backgroundColor: '#ccc',
  },
  note: {
    border: '1px solid #aaa',
    margin: '0.25em 0',
    padding: '0 0.5em',
  },
  newNoteField: {
    width: '100%',
  },
};
