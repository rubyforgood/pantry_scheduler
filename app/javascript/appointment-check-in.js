import React from 'react';

// FIXME: currently unused
export default class CheckIn extends React.Component {
  render() {
    return (
      <div>
        Appointment {this.props.match.params.id}
      </div>
    );
  }
}
