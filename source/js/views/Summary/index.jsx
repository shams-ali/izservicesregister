/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React, { Component } from 'react';
import axios from 'axios';
import _ from 'underscore';
import moment from 'moment';

export default class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fees: null,
      payments: null,
      summaryType: null,
    };

    this.summaries = [
      { summary: 'year', title: 'Current Year' },
      { summary: 'month', title: 'Current Month' },
    ];
    this.renderSummary = this.renderSummary.bind(this);
    this.renderSummaryTypes = this.renderSummaryTypes.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    this.getFees();
    this.getPayments();
  }

  onClick({ target: { value } }) {
    this.setState({ summaryType: value });
  }

  getFees() {
    axios.get('/api/v1/fees')
      .then(({ data: { data } }) => this.setState({ fees: data }))
      .catch((error) => console.error(error));
  }

  getPayments() {
    axios.get('/api/v1/payments')
      .then(({ data: { data } }) => this.setState({ payments: data }))
      .catch((error) => console.error(error));
  }

  calculatePayments(summaryType) {
    return this.state.payments
      .filter(({ created_at }) => moment(created_at).isSame(moment(), summaryType))
      .reduce((total, fee) => {
        total[fee.type] = +total[fee.type] + fee.amount || fee.amount;
        return total;
      }, {});
  }

  calculateFees(summaryType) {
    return this.state.fees
      .filter(({ created_at }) => moment(created_at).isSame(moment(), summaryType))
      .map(fee => _.pick(fee, 'dmv_fee', 'dmv_fee2', 'service_fee', 'other_fee', 'extra_discount', 'old_post_fee', 'ros_bos', 'ros_num', 'tax', 'vehicle_tax'))
      .reduce((total, fee) =>
        _.reduce(fee, (subTotal, amount, key) => {
          subTotal[key] = total[key] + amount || amount;
          return subTotal;
        }, total)
      , {});
  }

  renderSummaryTypes() {
    return (
      <div>
        <h4>What do you need help with?</h4><br />
        { this.summaries.map(({ summary, title }) => (
          <div key={ title } >
            <button
              className='btn btn-default btn-lg btn-block'
              onClick={ this.onClick }
              value={ summary }
            >
              {title}
            </button>
          </div>
        ))}
      </div>
    );
  }

  renderSummary() {
    const { summaryType } = this.state;
    return (
      <div>
        <h1>{summaryType.toUpperCase()}</h1>
        <h2>Payments Summary</h2>
        <table className='table table-condensed'>
          <thead>
            <tr>
              {_.map(this.calculatePayments(summaryType), (prop, key) =>
                <th key={ key }>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              {_.map(this.calculatePayments(summaryType), (prop, key) =>
                <td key={ key }>{prop}</td>)}
            </tr>
          </tbody>
        </table>
        <h2>Fees Summary</h2>
        <table className='table table-condensed'>
          <thead>
            <tr>
              {_.map(this.calculateFees(summaryType), (prop, key) =>
                <th key={ key }>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              {_.map(this.calculateFees(summaryType), (prop, key) =>
                <td key={ key }>{prop}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const { renderSummary, renderSummaryTypes } = this;
    const { summaryType } = this.state;

    return (
      <div className='row home'>
        <div className='col-md-12'>
          <div className='row'>
            <div className='col-md-12 text-center'>
              <h3>Invoice Summary Generator</h3>
              {!summaryType ? renderSummaryTypes() : renderSummary()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}