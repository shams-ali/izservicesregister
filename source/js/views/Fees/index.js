/* eslint no-param-reassign: off */
/* eslint no-alert: off */
/* eslint no-confirm: off */
/* eslint "no-confusing-arrow": off */
/* eslint max-len: ["error", 150]*/

import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import FormContainer from 'components/Global/FormContainer';
import RenderFees from 'components/Global/RenderFees';
import FeeDetails from '../FeeDetails';

class Fees extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fees: [],
      fee: null,
      totalPayments: null,
      totalFees: null,
      formActive: false,
      detailsActive: false,
      payments: [],
    };
    this.questions = {
      dmv_fee: {},
      dmv_fee2: {},
      service_fee: {},
      other_fee: {},
      extra_discount: {},
      old_post_fee: {},
      ros_bos: {},
      ros_num: {},
      tax: {},
      vehicle_tax: {},
    };

    this.createFee = this.createFee.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  componentDidMount() {
    this.getFees();
    this.getPayments();
  }

  getPayments() {
    axios.get(`http://registrationinvoiceserver:3000/v1/payments?vehicle_id=${ this.props.match.params.vehicle_id }`)
      .then(({ data: { data } }) => this.setState({ totalPayments: data.reduce((t, p) => t + +p.amount, 0) }))
      .catch((error) => console.error(error));
  }

  getFees() {
    axios.get(`http://registrationinvoiceserver:3000/v1/fees?vehicle_id=${ this.props.match.params.vehicle_id }`)
      .then(({ data: { data } }) => {
        this.setState({ fees: data, totalFees: data.reduce((t, f) => t + +f.total_amount, 0) });
      })
      .catch((error) => console.error(error));
  }

  createFee(e) {
    e.preventDefault();
    const data = _.reduce(e.target, (memo, value) => {
      memo[value.name] = value.value;
      return memo;
    }, {});

    data.total_amount = _.reduce(e.target, (memo, value) =>
      value.name === 'extra_discount' ? memo - +value.value : memo + +value.value, 0);

    data.vehicle_id = this.props.match.params.vehicle_id;
    data.client_id = this.props.match.params.client_id;
    JSON.stringify(data);
    axios.post('http://registrationinvoiceserver:3000/v1/fees', data)
      .then(response => console.warn('saved successfully', response))
      .catch(error => console.error(error));
  }

  toggleDetails(fee) {
    this.setState({ detailsActive: true, fee });
  }

  toggleForm() {
    this.setState({ formActive: !this.state.formActive });
  }

  togglePayment() {
    this.setState({ formActive: !this.state.formActive });
  }

  render() {
    const { client_id, vehicle_id } = this.props.match.params;
    const { totalPayments, totalFees } = this.state;
    return (
      <div>
        <div>Outstanding Balance: ${totalFees - totalPayments}</div>
        <table className='table table-condensed'>
          <thead>
            <tr>
              <th>Fees</th>
              <th>Date</th>
              <th />
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {this.state.fees &&
              this.state.fees.map((fee, i) =>
                <RenderFees
                  key={ i }
                  fee={ fee }
                  client_id={ client_id }
                  vehicle_id={ vehicle_id }
                  toggleDetails={ this.toggleDetails }
                />
            )}
          </tbody>
        </table>
        {this.state.detailsActive ? <FeeDetails fee={ this.state.fee } /> : null}
        {this.state.formActive ?
          <FormContainer
            type='Fee'
            create={ this.createFee }
            questions={ this.questions }
            toggleForm={ this.toggleForm }
          /> : <button onClick={ this.toggleForm }>Add A New Fee</button>
        }
      </div>
    );
  }
}

Fees.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Fees;
