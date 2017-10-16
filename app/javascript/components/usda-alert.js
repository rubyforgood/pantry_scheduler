import React, { Component } from 'react';

class UsdaAlert extends Component {
  constructor(props) {
    super(props)
    
    this.validateUSDACert = this.validateUSDACert.bind(this)
  }

  validateUSDACert() {
    const usdaCertDate = new Date(this.props.client.usda_cert_date)
    const today = new Date()
    const usdaCertYear = usdaCertDate.getFullYear();
    const usdaCertMonth = usdaCertDate.getMonth()
    const usdaCertDay = usdaCertDate.getDate()
    const expirationDate = new Date(usdaCertYear + 1, usdaCertMonth, usdaCertDay)
    const isExpired = expirationDate < today
    return (this.props.client.usda_qualifier === true) &&
      (this.props.client.usda_cert_date === null || isExpired )
  }

  render() {
    const alertDiv = <div style={styles.usdaAlert}>
                      <h3>
                        USDA certification date needs to be updated
                      </h3>
                    </div>
    const alert = this.validateUSDACert() ? alertDiv : null
    return (
      <div>
        { alert }
      </div>
    )
  }
}

const styles = {
  usdaAlert: {
    margin: '10px',
    padding: '10px',
    border: '2px solid black',
    textAlign: 'center',
    height: '4em'
  },
}

export default UsdaAlert