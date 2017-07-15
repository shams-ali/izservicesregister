/* eslint no-param-reassign: off */
/* eslint no-alert: off */
/* eslint no-confirm: off */
/* eslint "no-confusing-arrow": off */

import React, { PropTypes, Component } from 'react';
import axios from 'axios';
import moment from 'moment';

class RenderFees extends Component {

  constructor(props) {
    super(props);
    this.state = {
      totalPaid: null,
      detailsActive: false,
    };

    this.deleteFee = this.deleteFee.bind(this);
  }

  deleteFee({ target: { value } }) {
    axios.delete(`/api/v1/fees/${ value }`)
      .then(({ data }) => alert('User Deleted Successfully', data))
      .catch(error => alert(error));
    // TODO: force refresh
  }

  render() {
    const { fee, toggleDetails } = this.props;
    return (
      <tr key={ fee.id }>
        <td>${fee.total_amount}</td>
        <td>{moment(fee.created_at).format('MMMM Do YYYY')}</td>
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
          <button
            className='btn btn-primary btn-sm'
            id={ `enter${ fee.id }` }
            value={ fee.id }
            onClick={ () => toggleDetails(fee) }
          >
          Details
        </button>
        </td>
      </tr>
    );
  }
}

RenderFees.propTypes = {
  fee: PropTypes.object.isRequired,
  toggleDetails: PropTypes.func.isRequired,
};

export default RenderFees;
