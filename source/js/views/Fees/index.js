/* eslint no-param-reassign: off */
/* eslint no-alert: off */
/* eslint no-confirm: off */
/* eslint "no-confusing-arrow": off */
/* eslint max-len: ["error", 150]*/

import React, { PropTypes, Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import FormContainer from 'components/Global/FormContainer';
import FeeDetails from '../FeeDetails';

class Fees extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fees: {},
      fee: null,
      formActive: false,
      detailsActive: false,
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
    this.deleteFee = this.deleteFee.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  componentDidMount() {
    this.getFees();
  }

  getFees() {
    axios.get(`http://localhost:8080/v1/fees?vehicle_id=${ this.props.match.params.vehicle_id }`)
      .then(({ data: { data } }) => this.setState({ fees: data }))
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
    data.total_outstanding = data.total_amount;
    JSON.stringify(data);
    axios.post('http://localhost:8080/v1/fees', data)
      .then(response => console.warn('saved successfully', response))
      .catch(error => console.error(error));
  }

  deleteFee({ target: { value } }) {
    axios.delete(`http://localhost:8080/v1/fees/${ value }`)
      .then(({ data }) => alert('User Deleted Successfully', data))
      .catch(error => alert(error));
    // TODO: force refresh
  }

  toggleDetails(fee) {
    this.setState({ detailsActive: !this.state.detailsActive, fee });
  }

  toggleForm() {
    this.setState({ formActive: !this.state.formActive });
  }

  togglePayment() {
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
            {_.map(this.state.fees, (fee, i) => (
              <tr key={ fee.id }>
                <td>${fee.total_amount}</td>
                <td>${fee.total_outstanding}</td>
                <td>{fee.created_at}</td>
                <td>
                  <button
                    className='btn btn-primary btn-sm'
                    key={ fee.id }
                    id={ fee.id }
                    value={ fee.id }
                    onClick={ (e) => confirm('Delete Fee?') && this.deleteFee(e) }
                  >
                  Delete Fee
                </button>
                </td>
                <td>
                  <NavLink
                    to={ `/application/client/${ this.props.match.params.client_id }/vehicles/${ this.props.match.params.vehicle_id }/fees/${ fee.id }/payments` }
                    className='btn btn-primary btn-sm'
                    key={ i }
                    id={ `enter${ fee.id }` }
                    value={ fee.id }
                  >
                  View Payments
                </NavLink>
                </td>
                <td>
                  <button
                    className='btn btn-primary btn-sm'
                    key={ i }
                    id={ `enter${ fee.id }` }
                    value={ fee.id }
                    onClick={ () => this.toggleDetails(fee) }
                  >
                  Details
                </button>
                </td>
              </tr>
            ))}
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
