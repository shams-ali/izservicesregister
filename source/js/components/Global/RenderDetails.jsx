import React, { PropTypes } from 'react';
import _ from 'lodash';
import Moment from 'moment';

const RenderDetails = ({ data }) => (
  <div>
    <table className='table table-condensed'>
      <thead>
        <tr>
          {_.map(data, (prop, key) =>
            <th key={ key }>{key}</th>
          )}
        </tr>
        <tr>
          {_.map(data, (val, key) => (
            ['created_at', 'exp_date', 'updated_at'].includes(key) ?
              <th key={ key }>{new Moment(val).format('MMM Do YYYY')}</th> : <th key={ key }>{val}</th>
        ))}
        </tr>
      </thead>
      <thead />
    </table>
  </div>
);

RenderDetails.propTypes = {
  data: PropTypes.object.isRequired,
};

export default RenderDetails;
