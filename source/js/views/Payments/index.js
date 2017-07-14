/* eslint no-param-reassign: off */
/* eslint no-alert: off */
/* eslint no-confirm: off */
/* eslint "no-confusing-arrow": off */

import React, { PropTypes, Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import FormContainer from 'components/Global/FormContainer';

class Payments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      payments: {},
      payment: null,
      formActive: false,
      detailsActive: false,
    };
    this.questions = {
      dmv_payment: {},
      dmv_payment2: {},
      service_payment: {},
      other_payment: {},
      extra_discount: {},
      old_post_payment: {},
      ros_bos: {},
      ros_num: {},
      tax: {},
      vehicle_tax: {},
    };
    this.createPayment = this.createPayment.bind(this);
    this.deletePayment = this.deletePayment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  componentDidMount() {
    this.getPayments();
  }

  getPayments() {
    axios.get(`/v1/payments?payment_id=${ this.props.params.payment_id }`)
      .then(({ data: { data } }) => this.setState({ payments: data }))
      .catch((error) => console.error(error));
  }

  createPayment(e) {
    const data = _.reduce(e.target, (memo, value) => {
      memo[value.name] = value.value;
      return memo;
    }, {});
    data.total_amount = _.reduce(e.target, (memo, value) =>
      value.name === 'extra_discount' ? memo - value.value : memo + value.value, 0);
    data.vehicle_id = this.props.params.vehicle_id;
    data.client_id = this.props.params.client_id;
    data.total_outstanding = data.total_amount;
    JSON.stringify(data);
    axios.post('/v1/payments', data)
      .then(response => console.warn('saved successfully', response))
      .catch(error => console.error(error));
  }

  deletePayment({ target: { value } }) {
    axios.delete(`/v1/payments/${ value }`)
      .then(({ data }) => alert('User Deleted Successfully', data))
      .catch(error => alert(error));
    // TODO: force refresh
  }

  toggleDetails(payment) {
    this.setState({ detailsActive: !this.state.detailsActive, payment });
  }

  toggleForm() {
    this.setState({ formActive: !this.state.formActive });
  }

  render() {
    return (
      <div>
        <table className='table table-condensed'>
          <thead>
            <tr>
              <th>Total Amount</th>
              <th>Total Outstanding</th>
              <th>Date</th>
              <th />
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {_.map(this.state.payments, (payment, i) => (
              <tr key={ payment.id }>
                <td>${payment.total_amount}</td>
                <td>${payment.total_outstanding}</td>
                <td>{payment.created_at}</td>
                <td>
                  <button
                    className='btn btn-primary btn-sm'
                    key={ payment.id }
                    id={ payment.id }
                    value={ payment.id }
                    onClick={ (e) => confirm('Delete Payment?') && this.deletePayment(e) }
                  >
                  Delete Payment
                </button>
                </td>
                <td>
                  <button
                    className='btn btn-primary btn-sm'
                    key={ i }
                    id={ `enter${ payment.id }` }
                    value={ payment.id }
                    onClick={ this.goPayments }
                  >
                  Make Payment
                </button>
                </td>
                <td>
                  <button
                    className='btn btn-primary btn-sm'
                    key={ i }
                    id={ `enter${ payment.id }` }
                    value={ payment.id }
                    onClick={ () => this.toggleDetails(payment) }
                  >
                  Details
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* {this.state.detailsActive ? <PaymentDetails payment={this.state.payment} /> : null} */}
        {this.state.formActive ?
          <FormContainer
            type='Payment'
            create={ this.createPayment }
            questions={ this.questions }
            toggleForm={ this.toggleForm }
          /> : <button onClick={ this.toggleForm }>Add A New Payment</button>
        }
      </div>
    );
  }
}

Payments.propTypes = {
  params: PropTypes.object.isRequired,
};

export default Payments;
