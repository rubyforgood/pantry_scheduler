import React from 'react';
import { includes } from 'lodash';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export default class NewAppointment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      client: {},
      autocompleteClients: [],
      appointmentType: [],
      appointmentDate: moment(),
    };
  }

  render() {
    return (
      <div>
        <form
          onSubmit={this.save.bind(this)}
          style={Style.appointmentForm}
        >
          <div>
            <input
              placeholder="First Name"
              ref={(el) => this.firstName = el}
              onChange={(event) => {
                this.autocompleteName(event.target.value)
                  .then(({ clients }) => {
                    this.setState({ autocompleteClients: clients })
                  })
              }}
            />
            <input
              placeholder="Last Name"
              ref={(el) => this.lastName = el}
              onChange={(event) => {
                this.autocompleteName(event.target.value)
                  .then(({ clients }) => {
                    this.setState({ autocompleteClients: clients })
                  })
              }}
            />
            <div style={Style.autocompleteContainer}>
              <ul style={Style.autocompleteList}>
                {this.state.autocompleteClients.map(client => (
                  <li
                    style={Style.autocompleteListEntry}
                    key={client.id}
                    onClick={() => {
                      this.firstName.value = client.first_name;
                      this.lastName.value = client.last_name;
                      this.numAdults.value = client.num_adults;
                      this.numChildren.value = client.num_children;
                      this.usdaQualifier.checked = client.usda_qualifier;

                      this.setState({
                        client: client,
                        autocompleteClients: [],
                      });
                    }}
                  >
                    {[client.first_name, client.last_name].join(' ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <label>
              Adults
              <input
                type="number"
                ref={(el) => this.numAdults = el}
              />
            </label>
          </div>

          <div>
            <label>
              Children
              <input
                type="number"
                ref={(el) => this.numChildren = el}
              />
            </label>
          </div>

          <div>
            <label>
              USDA?
              <input
                type="checkbox"
                ref={(el) => this.usdaQualifier = el}
              />
            </label>
          </div>

          <div>
            Date
            <DatePicker
              selected={this.state.appointmentDate}
              onChange={(date) => { this.setState({ appointmentDate: date }) }}
            />
          </div>

          <div>
            Appointment Type
            <div>
              <label>
                <input
                  type="checkbox"
                  onChange={(event) => {
                    this.setState({
                      appointmentType: includes(this.state.appointmentType, 'food') ?
                        this.state.appointmentType.filter(type => type !== 'food') :
                        this.state.appointmentType.concat('food'),
                    })
                  }}
                />
                Food
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(event) => {
                    this.setState({
                      appointmentType: includes(this.state.appointmentType, 'utilities') ?
                        this.state.appointmentType.filter(type => type !== 'utilities') :
                        this.state.appointmentType.concat('utilities'),
                    })
                  }}
                />
                Utilities
              </label>
            </div>
          </div>

          <div>
            <button>Save</button>
          </div>
        </form>
      </div>
    );
  }

  save(event) {
    event.preventDefault();

    const blob = {
        appointment: {
          client_id: this.state.client.id,
          time: this.state.appointmentDate,
          num_adults: this.numAdults.value,
          num_children: this.numChildren.value,
          usda_qualifier: this.usdaQualifier.checked,
          appointment_type: this.state.appointmentType,
        },
      }

      console.log(blob);
    fetch('/api/appointments', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(blob),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      this.props.history.push('/');
    });
  }

  autocompleteName(text) {
    if(text) {
      return fetch(`/api/clients/autocomplete_name/${text}`, {
        credentials: 'include',
      }).then(response => response.json());
    } else {
      return Promise.resolve({ clients: [] });
    }
  }
}

const Style = {
  appointmentForm: {
    backgroundColor: 'white',
    padding: '1.5em 2em',
  },
  autocompleteContainer: {
    position: 'relative',
  },
  autocompleteList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    top: 0,
    position: 'absolute',
    backgroundColor: 'white',
  },
  autocompleteListEntry: {
    border: '1px solid #888',
    marginBottom: '-1px',
  },
};
