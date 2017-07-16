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

  // renderClientInfo(client) {
  //   return (
  //     <div>
  //       <h2>Client</h2>
  //       <table className='table table-condensed'>
  //         <thead>
  //           <tr>
  //             {
  //               _.chain(client)
  //               .omit('created_at')
  //               .map((prop, key) => <th key={ key }>{key.toUpperCase()}</th>)
  //               .value()
  //             }
  //           </tr>
  //         </thead>
  //         <tbody>
  //           <tr>
  //             {_.chain(client)
  //               .omit('created_at', 'updated_at')
  //               .map((val, key) => <td key={ key }>{ val }</td>)
  //               .value()
  //             }
  //           </tr>
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // }

  renderInfo(info, title) {
    return (
      <div>
        <h2>{title}</h2>
        <table className='table table-condensed'>
          <thead>
            <tr>
              {_.map(info, (prop, key) => <th key={ key }>{key.toUpperCase()}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              {_.map(info, (val, key) => <td key={ key }>{ val }</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderListInfo(infos, title, total) {
    return (
      <div>
        <h2>{title}: ${total}</h2>
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
    const { payments, totalPayments, fees, totalFees, vehicle, client } = this.state;

    return (
      <div>
        <h1>RECEIPT</h1>
        {!(_.isEmpty(vehicle)) && this.renderInfo(_.omit(vehicle, 'created_at', 'client', 'updated_at', 'exp_date'), 'Vehicle')}
        {!(_.isEmpty(client)) && this.renderInfo(_.omit(client, 'created_at', 'updated_at'), 'Client')}
        {!(_.isEmpty(fees)) && this.renderListInfo(fees.map(fee => _.pick(fee, 'id', 'dmv_fee', 'service_fee', 'tax', 'other_fee', 'total_amount', 'created_at')), 'Total Fees', totalFees)}
        {!(_.isEmpty(payments)) && this.renderListInfo(payments.map(p => _.omit(p, 'updated_at', 'client_id', 'vehicle_id')), 'Total Payments', totalPayments)}
      </div>
    );
  }

}

Receipt.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Receipt;
