import React from 'react';

export default class Directory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: [],
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
    const clientList = this.state.clients.map((client) => <Client client={client} key={client.id} />);
    return <div>{clientList}</div>;
  }

  render() {
    return this.state.clients.length > 0
      ? this.renderClientList()
      : <h4>Directory Unavailable</h4>
  }
}

const Client = ({ client }) => {
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
    <div>
      <h3>{`${client.first_name} ${client.last_name}`}</h3>
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
