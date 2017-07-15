/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React, { PropTypes, Component } from 'react';
import axios from 'axios';

class Receipt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      payment: null,
    };
    this.questions = {
      type: {},
      amount: {},
    };
  }

  componentDidMount() {
    console.log('hello');
    this.getPayment(this.props.match.params.id);
  }

  getPayment(id) {
    console.log(id);
    axios.get(`/api/v1/payments?id=${ id }`)
      .then(({ data: { data } }) => this.setState({ payment: data[0] }))
      .catch((error) => console.error(error));
  }

  render() {
    return (<div>
      { this.state.payment ? <div>{this.state.payment.amount}</div> : 'hi'}
    </div>);
  }

}

// Receipt.propTypes = {
//   match: PropTypes.object.isRequired,
// };

export default Receipt;
