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

    this.deleteFee = this.deleteFee.bind(this);
  }

  deleteFee({ target: { value } }) {
    axios.delete(`/api/v1/fees/${ value }`)
      .then(() => this.props.getFees())
      .catch(error => alert(error));
  }

  render() {
    const { fee, toggleDetails, toggleUpdateForm } = this.props;
    return (
      <tr key={ fee.id }>
        <td>${fee.total_amount}</td>
        <td>{moment(fee.created_at).format('MMMM Do YYYY')}</td>
        <td>
          <button
            className='btn btn-primary btn-sm'
            key='delete'
            id='delete'
            value={ fee.id }
            onClick={ (e) => confirm('Delete Fee?') && this.deleteFee(e) }
          >
          Delete Fee
          </button>
        </td>
        <td>
          <button
            className='btn btn-primary btn-sm'
            key='update'
            id='update'
            value={ fee.id }
            onClick={ () => toggleUpdateForm(fee) }
          >
          Update Fee
          </button>
        </td>
        <td>
          <button
            className='btn btn-primary btn-sm'
            key='details'
            id='details'
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
  getFees: PropTypes.func.isRequired,
  toggleUpdateForm: PropTypes.func.isRequired,
};

export default RenderFees;
