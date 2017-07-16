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
      totalPayments: 0,
      fees: [],
      totalFees: [],
      vehicles: {},
      client: {},
    };
  }

  componentDidMount() {
    this.getData(this.props.match.params.id, 'vehicle_id', 'Payments');
    this.getData(this.props.match.params.id, 'vehicle_id', 'Fees');
    this.getData(this.props.match.params.id, 'id', 'Vehicles');
  }

  getData(id, param, type) {
    axios.get(`/api/v1/${ type.toLowerCase() }?${ param }=${ id }`)
      .then(({ data: { data } }) =>
        this.setState({ [type.toLowerCase()]: data, [`total${ type }`]: data.reduce((t, p) => t + p.amount || p.total_amount || 1, 0) }))
      .catch((error) => console.error(error));
  }

  renderListInfo(infos, title, total) {
    return (
      <div>
        {total ? <h2>{title}: ${total}</h2> : <h2>{title}</h2>}
        <table className='table table-condensed'>
          <thead>
            <tr>
              {_.map(infos[0], (v, k) => <th key={ k }>{ k }</th>)}
            </tr>
          </thead>
          <tbody>
            {infos.map(info =>
              <tr key={ info.id }>
                {_.map(info, (val, key) => <td key={ key }>{key === 'created_at' ? moment(val).format('MMMM Do YYYY') : val }</td>)}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const { payments, totalPayments, fees, totalFees, vehicles } = this.state;

    return (
      <div>
        <h1>RECEIPT</h1>
        {!(_.isEmpty(vehicles)) && this.renderListInfo(vehicles.map(v => _.omit(v, 'created_at', 'client', 'updated_at', 'exp_date')), 'Vehicle')}
        {!(_.isEmpty(vehicles)) && this.renderListInfo(vehicles.map(v => v.client).map(c => _.omit(c, 'created_at', 'updated_at')), 'Client')}
        {!(_.isEmpty(fees)) && this.renderListInfo(fees.map(f => _.pick(f, 'id', 'dmv_fee', 'service_fee', 'tax', 'other_fee', 'total_amount', 'created_at')), 'Total Fees', totalFees)}
        {!(_.isEmpty(payments)) && this.renderListInfo(payments.map(p => _.omit(p, 'updated_at', 'client_id', 'vehicle_id')), 'Total Payments', totalPayments)}
        <h1>Total Outstanding: {totalFees - totalPayments}</h1>
      </div>
    );
  }

}

Receipt.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Receipt;
