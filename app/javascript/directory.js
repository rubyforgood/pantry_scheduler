import React from 'react';
import { Link } from 'react-router-dom';
import Modal from 'modal';
import ClientForm from 'client-form';

export default class Directory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: [],
      currentClient: null,
    }
  }

  componentDidMount() {
    fetch('/api/clients/')
      .then(response => response.json())
      .then(json => {
        this.setState({
          clients: json.clients || [],
       });
      })
      .catch(error => {
        this.setState({ fetchError: error });
      })
  }

  renderClientList() {
    const clientList = this.state.clients.map((client, index) => (
      <Client client={client} key={client.id} index={index} onClick={() => this.setState({ currentClient: client })} />
    ));

    return (
      <div style={styles.container}>
        <h2 style={styles.header}>Client Directory</h2>
        {clientList}
        {this.renderModal()}
      </div>
    );
  }

  renderModal() {
    if(this.state.currentClient) {
      return (
        <Modal onClose={() => this.setState({currentClient: null})}>
          <ClientForm
            client={this.state.currentClient}
          />
        </Modal>
      )
    }
  }

  render() {
    return this.state.clients.length > 0
      ? this.renderClientList()
      : <h4>Directory Unavailable</h4>
  }
}

const Client = ({ client, index, onClick }) => {
  const {
    first_name,
    last_name,
    address,
    county,
    zip,
    phone_number,
    cell_number,
    email,
    num_adults,
    num_children,
    usda_qualifier,
    usda_cert_date,
  } = client;

  const familySize = `Family Size: ${num_adults + num_children} (Adults: ${num_adults} / Children: ${num_children})`;

  const usda = `USDA Status: ${usda_qualifier ? 'yes' : 'no'}
    ${usda_qualifier && usda_cert_date ? 'USDA Certification: ' + usda_cert_date : ''}`;

  const location = `Address: ${address}, Zip: ${zip}, County: ${county}`;

  const contact = `${formatField(phone_number, 'Phone', ',')}
    ${formatField(cell_number, 'Cell', ',')}
    ${formatField(email, 'E-mail', '')}`;

  return (
    <div style={index % 2 == 0 ? styles.lightRow : styles.darkRow}>
      <a
        onClick={onClick}
        href={`#client/${client.id}`}
        style={styles.rowHeader}
      >
        {`${client.first_name} ${client.last_name}`}
      </a>
      <div>{familySize}</div>
      <div>{usda}</div>
      <div>{location}</div>
      <div>{contact}</div>
    </div>
  );
};

const formatField = (field, label, punctation) => {
  return field ? `${label}: ${field + punctation}` : '';
}


const styles = {
  container: {
    marginLeft: 40,
    marginRight: 40,
  },
  darkRow: {
    backgroundColor: '#D1D1D1',
    padding: 15,
  },
  header: {
    textAlign: 'center',
  },
  lightRow: {
    backgroundColor: '#E5E5E5',
    padding: 15,
  },
  rowHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
};
