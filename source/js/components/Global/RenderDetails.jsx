import React, { PropTypes } from 'react';
import _ from 'lodash';

const FeeDetails = ({ data }) => (
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
            <th key={ key }>{val}</th>
        ))}
        </tr>
      </thead>
      <thead />
    </table>
  </div>
);

FeeDetails.propTypes = {
  data: PropTypes.object.isRequired,
};

export default FeeDetails;
