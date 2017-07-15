/* eslint no-param-reassign: off */
/* eslint no-alert: off */
/* eslint no-confirm: off */
/* eslint "no-confusing-arrow": off */

import React, { PropTypes, Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import FormContainer from 'components/Global/FormContainer';

class Payments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      payment: null,
      originalAmount: null,
      formActive: false,
      detailsActive: false,
    };
    this.questions = {
      type: {},
      amount: {},
    };
    this.createPayment = this.createPayment.bind(this);
    this.deletePayment = this.deletePayment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  componentDidMount() {
    this.getPayments();
    this.getFee();
  }

  getPayments() {
    axios.get(`http://localhost:8080/v1/payments?fee_id=${ this.props.match.params.fee_id }`)
      .then(({ data: { data } }) => this.setState({ payments: data }))
      .catch((error) => console.error(error));
  }

  getFee() {
    axios.get(`http://localhost:8080/v1/fees?id=${ this.props.match.params.fee_id }`)
      .then(({ data: { data } }) => this.setState({ originalAmount: data[0].total_amount }))
      .catch((error) => console.error(error));
  }

  createPayment(e) {
    const data = _.reduce(e.target, (memo, value) => {
      memo[value.name] = value.value;
      return memo;
    }, {});

    data.vehicle_id = this.props.match.params.vehicle_id;
    data.client_id = this.props.match.params.client_id;
    data.fee_id = this.props.match.params.fee_id;

    JSON.stringify(data);
    axios.post('http://localhost:8080/v1/payments', data)
      .then(response => console.warn('saved successfully', response))
      .catch(error => console.error(error));
  }

  deletePayment({ target: { value } }) {
    axios.delete(`http://localhost:8080/v1/payments/${ value }`)
      .then(({ data }) => alert('Payment Deleted Successfully', data))
      .catch(error => alert(error));
  }

  toggleDetails(payment) {
    this.setState({ detailsActive: !this.state.detailsActive, payment });
  }

  toggleForm() {
    this.setState({ formActive: !this.state.formActive });
  }

  render() {
    const { originalAmount, payments } = this.state;
    return (
      <div>
        <div>Original Amount: ${originalAmount}</div>
        <div>Outstanding Balance: ${originalAmount - payments.reduce((t, p) => p.amount + t, 0)}</div>
        <table className='table table-condensed'>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th />
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {this.state.payments.map((payment, i) => (
              <tr key={ payment.id }>
                <td>{payment.type}</td>
                <td>${payment.amount}</td>
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
                  <NavLink
                    to={ `/receipt/${ payment.id }` }
                    className='btn btn-primary btn-sm'
                    id={ `enter${ payment.id }` }
                    value={ payment.id }
                  >
                  Get Reciept
                </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/*{this.state.detailsActive ? <PaymentDetails payment={this.state.payment} /> : null} */}
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
  match: PropTypes.object.isRequired,
};

export default Payments;
