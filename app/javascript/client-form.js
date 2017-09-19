import React, { Component } from 'react';
import { func, object } from 'prop-types';

export default class ClientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
    }
  }

  checkIn(event) {
    event.preventDefault();
    this.setState({ saving: true });

    return fetch(`/api/appointments/${this.props.appointment.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointment: {
            checked_in_at: new Date().toUTCString()
          },
        }),
      })
      .then(response => response.json())
      .then(json => this.props.onCheckIn(json.appointment))
  }

  submit(event) {
    event.preventDefault();
    this.setState({ saving: true });

    let url = Number.isInteger(this.props.client.id) ? `/api/clients/${this.props.client.id}` : `/api/clients`
    let method = Number.isInteger(this.props.client.id) ? 'PUT' : 'POST'

    return fetch(url, {
        method: method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client: {
            first_name: this.firstName.value,
            last_name: this.lastName.value,
            address: this.address.value,
            zip: this.address.value,
            county: this.county.value,
            phone_number: this.phoneNumber.value,
            cell_number: this.cellNumber.value,
            email: this.email.value,
            num_adults: this.numAdults.value,
            num_children: this.numChildren.value,
            usda_qualifier: this.usdaQualifier.value,
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
      <section style={styles.clientInfoBox}>
        <form>
          <div>
            <h2>Client Information</h2>
            <label>Name: </label>
            <input
              ref={(element) => this.firstName = element}
              defaultValue={this.props.client.first_name}
              disabled={this.state.saving}
              placeholder="First"
            />
            <input
              ref={(element) => this.lastName = element}
              defaultValue={this.props.client.last_name}
              disabled={this.state.saving}
              placeholder="Last"
            />
          </div>
          <div style={styles.row}>
            <label>Address: </label>
            <input
              ref={(element) => this.address = element}
              defaultValue={this.props.client.address}
              disabled={this.state.saving}
              placeholder="123 Main St"
            />
          </div>
          <div>
            <label>Zip: </label>
            <input
              ref={(element) => this.zip = element}
              defaultValue={this.props.client.zip}
              disabled={this.state.saving}
              placeholder="#####"
            />
            <label> County: </label>
            <select
              ref={(element) => this.county = element}
              defaultValue={this.props.client.county}
              disabled={this.state.saving}
            >
              <option />
              <option value="AA">Anne Arundel</option>
              <option value="HO">Howard</option>
              <option value="PG">Prince George</option>
            </select>
          </div>
          <div style={styles.row}>
            <label style={styles.bold}>Phone </label>
            <label>(H):</label>
            <input
              ref={(element) => this.phoneNumber = element}
              defaultValue={this.props.client.phone_number}
              disabled={this.state.saving}
              placeholder="Home number"
            />
            {'  '}
            <label>(C):</label>
            <input
              ref={(element) => this.cellNumber = element}
              defaultValue={this.props.client.cell_number}
              disabled={this.state.saving}
              placeholder="Cell number"
            />
          </div>
          <div>
            <label>Email: </label>
            <input
              ref={(element) => this.email = element}
              defaultValue={this.props.client.email}
              disabled={this.state.saving}
              placeholder="me@example.com"
            />
          </div>
          <div style={styles.row}>
            <legend style={styles.bold}>Family Info</legend>
            <label>Adults: </label>
            <input
              ref={(element) => this.numAdults = element}
              defaultValue={this.props.client.num_adults}
              disabled={this.state.saving}
            />
            <label> Children: </label>
            <input
              ref={(element) => this.numChildren = element}
              defaultValue={this.props.client.num_children}
              disabled={this.state.saving}
            />
          </div>
          <div style={styles.row}>
            <label>USDA Cert: </label>
            <label>
              <input
                name="usda_qualifier"
                type="radio"
                defaultChecked={this.props.client.usda_qualifier}
                onChange={() => this.usdaQualifier = { value: true }}
              />
              Y
            </label>
            {' '}
            <label>
              <input
                name="usda_qualifier"
                type="radio"
                ref={() => this.usdaQualifier = { value: this.props.client.usda_qualifier }}
                defaultChecked={this.props.client.usda_qualifier === false}
                onChange={() => this.usdaQualifier = { value: false }}
              />
              N
            </label>
          </div>

          <div>
            { this.props.client.usda_cert_date
              ? <label>USDA Cert Date: </label>
              : null
            }
          </div>

          <div style={styles.row}>
            <label style={styles.bold}>Notes: </label>
            {this.renderNotesSection()}
          </div>

          <div>
            <button style={styles.button} onClick={this.submit.bind(this)}>Save</button>
            { this.props.onCheckIn && (
              <button onClick={this.checkIn.bind(this)}>Check In</button>
            ) }
          </div>
        </form>
        < UsdaAlert clientInfo={this.props.client} />
      </section>
    );
  }

  renderNotesSection() {
    if (this.props.notes && this.props.notes.length > 0) {
      return (
        this.props.notes.map(note => (
          <div key={note.id} style={styles.note}>
            <p>{note.body}</p>
          </div>
        )));
     }
     return <div>N/A</div>;
   }
}

ClientForm.propTypes = {
  client: object.isRequired,
  onSave: func.isRequired,
}

const styles = {
  bold: {
    fontWeight: 'bold',
  },
  row: {
    marginTop: 20,
  },
  button: {
    marginTop: 10,
    padding: 10,
  },
  note: {
    margin: '0.25em 0',
    padding: '0 0.5em',
  },
  clientInfoBox: {
    display: 'flex',
    flexDirection: 'row'
  },
  usdaAlert: {
    margin: '10px',
    border: '2px solid black',
    textAlign: 'center',
    height: '5.5em'
  }

};

class UsdaAlert extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.validateUSDACert = this.validateUSDACert.bind(this)
  }

  validateUSDACert () {
    const usdaCertDate = new Date(this.props.clientInfo.usda_cert_date)
    const today = new Date()
    const usdaCertYear = usdaCertDate.getFullYear();
    const usdaCertMonth = usdaCertDate.getMonth()
    const usdaCertDay = usdaCertDate.getDate()
    const expirationDate = new Date(usdaCertYear + 1, usdaCertMonth, usdaCertDay)
    const isExpired = expirationDate < today
    return (this.props.clientInfo.usda_qualifier === true) && 
      (this.props.clientInfo.usda_cert_date === null || isExpired )
  }

  render() {
    const alertDiv =  <div style={styles.usdaAlert}><h3>USDA certification is not signed or has expired</h3></div>
    const alert = this.validateUSDACert() ? alertDiv : null
    return (
      <div>
        { alert }
      </div>
    )
  }
}
