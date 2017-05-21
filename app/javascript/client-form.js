import React, { Component } from 'react';
import { func, object } from 'prop-types';

export default class ClientForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
    }
  }

  save(event) {
    event.preventDefault();

    return fetch(`/api/clients/${this.props.client.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client: {
            first_name: this.firstName.value,
          },
        }),
      })
      .then(response => response.json())
      .then(json => this.props.onSave(json.client))
  }

  reset() {
  }

  render() {
    return (
      <form
        onSubmit={(event) => {
          this.setState({ saving: true });
          this.save(event)
            .then(() => this.setState({ saving: false }))
            .then(this.reset)
        }}
      >
        <div>
          <label htmlFor="client[first_name]">First name</label>
          <input
            name="client[first_name]"
            type="text"
            ref={(element) => this.firstName = element}
            defaultValue={this.props.client.first_name}
            disabled={this.state.saving}
          />
        </div>
        <div>
          <button>Save</button>
        </div>
      </form>
    );
  }
}

ClientForm.propTypes = {
  client: object.isRequired,
  onSave: func.isRequired,
}
