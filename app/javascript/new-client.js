import React from 'react';
import ClientForm from 'client-form';

export default class NewClient extends React.Component {
  render() {
    return (
      <ClientForm
        client={{}}
        onSave={() => { this.props.history.push('/'); }}
      />)
  }
}
