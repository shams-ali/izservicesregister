/* eslint no-param-reassign: off */
/* eslint no-alert: off */
/* eslint no-confirm: off */
/* eslint "no-confusing-arrow": off */
/* eslint max-len: ["error", 150]*/
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import FormContainer from 'components/Global/FormContainer';
import RenderFees from 'components/Global/RenderFees';
import RenderDetails from 'components/Global/RenderDetails';

class Fees extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fees: [],
      fee: null,
      totalPayments: null,
      totalFees: null,
      formActive: false,
      formUpdateActive: false,
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
      type: {},
      comments: {},
      status: {},
    };

    this.createFee = this.createFee.bind(this);
    this.updateFee = this.updateFee.bind(this);
    this.getFees = this.getFees.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.toggleUpdateForm = this.toggleUpdateForm.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  componentDidMount() {
    this.getFees();
    this.getPayments();
  }

  getPayments() {
    axios.get(`/api/v1/payments?vehicle_id=${ this.props.match.params.vehicleId }`)
      .then(({ data: { data } }) => this.setState({ totalPayments: data.reduce((t, p) => t + +p.amount, 0) }))
      .catch((error) => console.error(error));
  }

  getFees() {
    axios.get(`/api/v1/fees?vehicle_id=${ this.props.match.params.vehicleId }`)
      .then(({ data: { data } }) => {
        this.setState({
          detailsActive: false,
          fees: data,
          formActive: false,
          formUpdateActive: false,
          totalFees: data.reduce((t, f) => t + +f.total_amount, 0),
        });
      })
      .catch((error) => console.error(error));
  }

  createFee(e) {
    e.preventDefault();
    const data = _.reduce(e.target, (memo, value) => {
      memo[value.name] = value.value;
      return memo;
    }, {});

    data.total_amount = _.chain(data)
      .omit('type', 'comments', 'status')
      .reduce((memo, value, name) =>
        name === 'extra_discount' ? memo - +value : memo + +value, 0)
      .value();

    data.vehicle_id = this.props.match.params.vehicleId;
    data.client_id = this.props.match.params.clientId;

    axios.post('/api/v1/fees', data)
      .then(() => this.getFees())
      .catch(error => console.error(error));
  }

  updateFee(e) {
    const { fee } = this.state;
    e.preventDefault();

    const data = _.reduce(e.target, (memo, { name, value }) => {
      if (value) {
        memo[name] = value;
      }
      return memo;
    }, {});

    const updated = Object.assign(fee, data);

    updated.total_amount = _.chain(updated)
      .omit('created_at', 'updated_at', 'id', 'vehicle_id', 'client_id', 'total_amount')
      .reduce((memo, value, name) => name === 'extra_discount' ? memo - +value : memo + +value, 0)
      .value();


    axios.put(`/api/v1/fees/${ fee.id }`, updated)
      .then(() => this.getFees())
      .catch(error => console.error(error));
  }

  toggleDetails(fee) {
    this.setState({ detailsActive: true, fee });
  }

  toggleForm() {
    this.setState({ formActive: !this.state.formActive, formUpdateActive: false });
  }

  toggleUpdateForm(fee) {
    this.setState({
      formUpdateActive: !this.state.formUpdateActive,
      formActive: false,
      fee,
    });
  }

  togglePayment() {
    this.setState({ formActive: !this.state.formActive });
  }

  render() {
    const { totalPayments, totalFees, formActive, formUpdateActive, detailsActive, fee, fees } = this.state;
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
            {fees &&
              fees.map((item, i) =>
                <RenderFees
                  key={ i }
                  fee={ item }
                  toggleDetails={ this.toggleDetails }
                  toggleUpdateForm={ this.toggleUpdateForm }
                  getFees={ this.getFees }
                />
            )}
          </tbody>
        </table>
        <div>Total Fees: {totalFees}</div>
        <div>Total Payments: {totalPayments}</div>
        {detailsActive &&
          <RenderDetails
            data={ _.omit(fee, 'id', 'vehicle_id', 'client_id') } 
          />
        }
        {formActive ?
          <FormContainer
            type='Fee'
            create={ this.createFee }
            questions={ this.questions }
            toggleForm={ this.toggleForm }
          /> : <button onClick={ this.toggleForm }>Add A New Fee</button>
        }
        {formUpdateActive &&
          <FormContainer
            type='Fee'
            create={ this.updateFee }
            questions={ this.questions }
            toggleForm={ this.toggleUpdateForm }
          />
        }
      </div>
    );
  }
}

Fees.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Fees;
