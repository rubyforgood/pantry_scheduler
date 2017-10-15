import React, { Component } from 'react';

export default class Modal extends Component {
  render() {
    return (
      <div style={Style.modalOverlay} onClick={this.props.onClose}>
        <div style={Style.modal} onClick={event => event.stopPropagation()}>
          <button onClick={this.props.onClose} style={Style.closeIcon}>&times;</button>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const Style = {
  closeIcon: {
    float: 'right',
    minHeight: 40,
    minWidth: 40,
    fontSize: 20,
    marginBottom: 20,
  },
  modalOverlay: {
    position: 'fixed',
    overflow: 'scroll',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  modal: {
    width: '50%',
    backgroundColor: 'white',
    margin: '10vh auto 0',
    padding: '2em',
  },
};
