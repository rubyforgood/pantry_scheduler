import React, { Component } from 'react';
import { object } from 'prop-types';

export default class ClientForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
    }
  }

  save(event) {
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
          <input
            type="text"
            ref={(element) => this.firstName = element}
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
}
