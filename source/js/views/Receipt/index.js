/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React, { PropTypes, Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

class Receipt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      totalPayments: [],
      fees: [],
      totalFees: [],
      vehicle: {},
    };
  }

  componentDidMount() {
    this.getPayments(this.props.match.params.id);
    this.getFees(this.props.match.params.id);
    this.getVehicle(this.props.match.params.id);
  }

  getPayments(id) {
    axios.get(`/api/v1/payments?vehicle_id=${ id }`)
      .then(({ data: { data } }) =>
        this.setState({ payments: data, totalPayments: data.reduce((t, p) => t + +p.amount, 0) }))
      .catch((error) => console.error(error));
  }

  getFees(id) {
    axios.get(`/api/v1/fees?vehicle_id=${ id }`)
      .then(({ data: { data } }) =>
        this.setState({ fees: data, totalFees: data.reduce((t, f) => t + +f.total_amount, 0) }))
      .catch((error) => console.error(error));
  }

  getVehicle(id) {
    axios.get(`/api/v1/vehicles?id=${ id }`)
      .then(({ data: { data } }) => this.setState({ vehicle: data[0] }))
      .catch((error) => console.error(error));
  }

  render() {
    const { payments, totalPayments, fees, totalFees, vehicle } = this.state;
    const { make, vin } = vehicle;

    return (
      <div>
        <h1>RECEIPT</h1>
        <h1>Make: {make.toUpperCase()} VIN: {vin.toUpperCase()} </h1>
        <div>
          <h2>Total Fees: ${totalFees}</h2>
          <table className='table table-condensed'> 
            <thead>
              <tr>
                {['dmv', 'service', 'tax', 'other', 'total amount', 'created at']
                  .map((prop, key) => <th key={ key }>{prop.toUpperCase()}</th>)
                }
              </tr>
            </thead>
            <tbody>
              {fees.map(fee =>
                <tr key={ fee.id }>
                  {_.chain(fee)
                    .pick('dmv_fee', 'service_fee', 'tax', 'other_fee', 'total_amount', 'created_at')
                    .map((val, key) => <td key={ key }>{key === 'created_at' ? moment(val).format('MMMM Do YYYY') : `$${ val }`}</td>)
                    .value()
                  }
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          <h2>Payments:  ${totalPayments}</h2>
          <table className='table table-condensed'> 
            <thead>
              <tr>
                {['type', 'amount', 'created_at']
                  .map((prop, key) => <th key={ key }>{prop.toUpperCase()}</th>)
                }
              </tr>
            </thead>
            <tbody>
              {payments.map(payment =>
                <tr key={ payment.id }>
                  {_.chain(payment)
                    .pick('type', 'amount', 'created_at')
                    .map((val, key) => <td key={ key }>{key === 'created_at' ? moment(val).format('MMMM Do YYYY') : val}</td>)
                    .value()
                  }
                </tr>
              )}
            </tbody>
          </table>
          <h1>Outstanding Balance: ${totalFees - totalPayments}</h1>
        </div>
      </div>
    );
  }

}

Receipt.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Receipt;
