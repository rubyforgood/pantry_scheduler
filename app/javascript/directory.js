import React from 'react';

export default class Directory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: []
    }
  }

  componentDidMount() {
    const clients = [
      {
        first_name: "Jane",
        last_name: "Doe",
        address: "1234 North Street",
        county: "Prince George",
        zip: 32145,
        phone_number: "4172226666",
        cell_number: "4173336666",
        email: "fakeuser@example.com",
        num_adults: 2,
        num_children: 4,
        usda_qualifier: true,
      },
      {
        first_name: "Jane",
        last_name: "Doe",
        address: "567 North Street",
        county: "Prince George",
        zip: 32145,
        cell_number: "1232226666",
        email: "fakeuser2@example.com",
        usda_cert_date: "2017,01,01",
        num_adults: 3,
        num_children: 0,
        usda_qualifier: true,
      },
      {
        first_name: "Ken",
        last_name: "Tanaka",
        address: "40 Sweet Street",
        county: "Adurundal",
        zip: 32145,
        phone_number: "4172226666",
        email: "fakeuser3@example.com",
        num_adults: 2,
        num_children: 4,
        usda_qualifier: false,
      },
    ];

    this.setState({ clients });
  }

  renderClientList() {
    const clientList = this.state.clients.map((client) => <Client client={client} />);
    return <div>{clientList}</div>;
  }

  render() {
    return this.state.clients.length > 0
      ? this.renderClientList()
      : <h4>Loading Clients</h4>
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
