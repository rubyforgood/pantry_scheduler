import React from 'react';

export default class CheckIn extends React.Component {
  render() {
    return (
      <div>
        Appointment {this.props.match.params.id}
      </div>
    );
  }
}
