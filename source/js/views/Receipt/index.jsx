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
      totalFees: 0,
      vehicles: {},
      client: {},
    };
    this.renderName = this.renderName.bind(this);
  }

  componentDidMount() {
    this.getData(this.props.match.params.id, 'vehicle_id', 'Payments');
    this.getData(this.props.match.params.id, 'vehicle_id', 'Fees');
    this.getData(this.props.match.params.id, 'id', 'Vehicles');
  }

  getData(id, param, type) {
    axios.get(`/api/v1/${ type.toLowerCase() }?${ param }=${ id }`)
      .then(({ data: { data } }) =>
        this.setState({ [type.toLowerCase()]: data, [`total${ type }`]: data.reduce((t, p) => t + p.amount || t + p.total_amount || t + 0, 0) }))
      .catch((error) => console.error(error));
  }
  renderName(title) {
    return title;
  }

  renderListInfo(infos, title, total, idName) {
                      // key === 'created_at' ? moment(val).format('MMMM Do YYYY') : val
    return (
      <div>
        {total ? <h2>{title}: ${total}</h2> : <h2>{title}</h2>}
        <table className='table table-condensed'>
          <thead>
            <tr>
              {_.map(infos[0], (v, k) => <th key={ k }>{
                k === 'id' ? idName : k
              }</th>)}
            </tr>
          </thead>
          <tbody>
            {infos.map(info =>
              <tr key={ info.id }>
                {_.map(info, (val, key) => {
                  if (key === 'created_at') {
                    return <td key={ key }>{moment(val).format('MMMM Do YYYY')}</td>;
                  } else if (key === 'phone') {
                    return <td key={ key }>{phoneFormatter.format(val.toString(), '(NNN) NNN-NNNN')}</td>;
                  } else if (key === 'id') {
                    // they dont want to see single digit id numbers...
                    return <td key={ key }>{+val + 100}</td>;
                  } else {
                    return <td key={ key }>{val}</td>;
                  }
                })}
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
        {!(_.isEmpty(vehicles)) && this.renderListInfo(vehicles.map(v => _.omit(v, 'created_at', 'client', 'updated_at', 'exp_date')), 'Vehicle', null, 'Vehicle ID')}
        {!(_.isEmpty(vehicles)) && this.renderListInfo(vehicles.map(v => v.client).map(c => _.omit(c, 'created_at', 'updated_at')), 'Client', null, 'Customer ID')}
        {!(_.isEmpty(fees)) && this.renderListInfo(fees.map(f => _.pick(f, 'id', 'dmv_fee', 'service_fee', 'tax', 'other_fee', 'total_amount', 'created_at')), 'Total Fees', totalFees, 'Invoice #')}
        {!(_.isEmpty(payments)) && this.renderListInfo(payments.map(p => _.omit(p, 'updated_at', 'client_id', 'vehicle_id')), 'Total Payments', totalPayments, 'Reciept #')}
        <h1>Total Outstanding: ${totalFees - totalPayments}</h1>
      </div>
    );
  }

}

Receipt.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Receipt;
