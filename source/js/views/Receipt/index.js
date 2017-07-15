import React, { PropTypes, Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

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
    this.getPayment(this.props.match.params.id);
  }

  getPayment(id) {
    axios.get(`http://localhost:8080/v1/payments?id=${ id }`)
      .then(({ data: { data } }) => this.setState({ payment: data[0] }))
      .catch((error) => console.error(error));
  }

  render() {
    return (<div>
    { this.state.payment ? <div>{this.state.payment.amount}</div> : null}
    </div>);
  }

}

export default Receipt;
