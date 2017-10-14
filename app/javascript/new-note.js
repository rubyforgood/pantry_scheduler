import React from 'react';

export default class NewNote extends React.Component {
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

const Style = {
  button: {
    marginTop: 10,
    padding: 10,
  },
  newNoteField: {
    width: '100%',
  },
};
