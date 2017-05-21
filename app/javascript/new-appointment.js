import React from 'react';
import { includes } from 'lodash';

export default class NewAppointment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      client: {},
      autocompleteClients: [],
      appointmentType: [],
    };
  }

  render() {
    return (
      <div>
        <form
          onSubmit={this.save.bind(this)}
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
            <div>
              <ul style={Style.autocompleteList}>
                {this.state.autocompleteClients.map(client => (
                  <li
                    style={Style.autocompleteListEntry}
                    key={client.id}
                    onClick={() => {
                      this.firstName.value = client.first_name;
                      this.lastName.value = client.last_name;
                      this.familySize.value = (client.num_adults|0) + (client.num_children|0);
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
              Family Size
              <input
                type="number"
                ref={(el) => this.familySize = el}
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
          time: new Date().toISOString(),
          family_size: this.familySize.value,
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
    return fetch(`/api/clients/autocomplete_name/${text}`, {
      credentials: 'include',
    }).then(response => response.json())
  }
}

const Style = {
  autocompleteList: {
    listStyle: 'none',
    padding: 0,
  },
  autocompleteListEntry: {
    border: '1px solid #888',
  },
};
