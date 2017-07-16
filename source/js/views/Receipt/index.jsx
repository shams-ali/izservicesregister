/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React, { PropTypes, Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import phoneFormatter from 'phone-formatter';

class Receipt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      totalPayments: [],
      fees: [],
      totalFees: [],
      vehicle: {},
      client: {},
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
      .then(({ data: { data } }) => this.setState({ vehicle: data[0], client: data[0].client }))
      .catch((error) => console.error(error));
  }
  renderClientInfo({ name, phone, email, dl, address, city, state, zip }) {
    return (
      <div>
        <h1>Client</h1>
        <div>
          { `${ name } ${ email } ${ phoneFormatter.format(phone.toString(), '(NNN) NNN-NNNN') }` }
        </div>
        <div>
          dl#: { dl }
        </div>
        <div>
          { address }
        </div>
        <div>
          {` ${ city } ${ state } ${ zip } `}
        </div>
      </div>
    );
  }

  render() {
    const { payments, totalPayments, fees, totalFees, vehicle, client } = this.state;
    const { make, vin, model_year, plate, id } = vehicle;

    return (
      <div>
        <h1>RECEIPT</h1>
        {!(_.isEmpty(vehicle)) && <h1>Make: {make.toUpperCase()} VIN: {vin.toUpperCase()} Year: { model_year } Plate: { plate } ID: { id }</h1>}
        {!(_.isEmpty(vehicle)) && this.renderClientInfo(client)}
        <div>
          <h2>Total Fees: ${totalFees}</h2>
          <table className='table table-condensed'>
            <thead>
              <tr>
                {['dmv', 'service', 'tax', 'other', 'total amount', 'created at', 'id']
                  .map((prop, key) => <th key={ key }>{prop.toUpperCase()}</th>)
                }
              </tr>
            </thead>
            <tbody>
              {fees.map(fee =>
                <tr key={ fee.id }>
                  {_.chain(fee)
                    .pick('dmv_fee', 'service_fee', 'tax', 'other_fee', 'total_amount', 'created_at', 'id')
                    .map((val, key) => <td key={ key }>{key === 'created_at' ? moment(val).format('MMMM Do YYYY') : `$${ val }`}</td>)
                    .value()
                  }
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          <h2>Payments: ${totalPayments}</h2>
          <table className='table table-condensed'>
            <thead>
              <tr>
                {['type', 'amount', 'created at', 'id']
                  .map((prop, key) => <th key={ key }>{prop.toUpperCase()}</th>)
                }
              </tr>
            </thead>
            <tbody>
              {payments.map(payment =>
                <tr key={ payment.id }>
                  {_.chain(payment)
                    .pick('type', 'amount', 'created_at', 'id')
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
