/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
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
    this.getData('fees');
    this.getData('payments');
  }

  onClick({ target: { value } }) {
    this.setState({ summaryType: value });
  }

  getData(type) {
    axios.get(`/api/v1/${ type }`)
      .then(({ data: { data } }) => this.setState({ [type]: data }))
      .catch((error) => console.error(error));
  }

  calculatePayments(summaryType) {
    const summary = this.state.payments
      .filter(({ created_at }) => moment(created_at).isSame(moment(), summaryType))
      .reduce((total, { type, amount }) =>
        Object.assign({ [type]: +total[type] + amount || amount }, total), {});

    return _.extend(summary, { total: _.sum(Object.values(summary)) });
  }

  calculateFees(summaryType) {
    return this.state.fees
      .filter(({ created_at }) => moment(created_at).isSame(moment(), summaryType))
      .map(fee => _.omit(fee, 'vehicle_id', 'client_id', 'id', 'created_at', 'updated_at'))
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

  renderSummary(data, title) {
    return (
      <div>
        <h2>{title} Summary</h2>
        <table className='table table-condensed'>
          <thead>
            <tr>
              {_.map(data, (prop, key) =>
                <th key={ key }>{key}</th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              {_.map(data, (prop, key) =>
                <td key={ key }>{prop}</td>
              )}
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
              {!summaryType ? renderSummaryTypes() :
              <div>
                <h1>{summaryType.toUpperCase()}</h1>
                {renderSummary(this.calculatePayments(summaryType), 'Payments')}
                {renderSummary(this.calculateFees(summaryType), 'Fees')}
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
