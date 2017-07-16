import React, { PropTypes } from 'react';
import _ from 'lodash';

const FeeDetails = ({ fee }) => (
  <div>
    <table className='table table-condensed'>
      <thead>
        <tr>
          {_.map(fee, (prop, key) =>
            <th key={ key }>{key}</th>
          )}
        </tr>
        <tr>
          {_.map(fee, (val, key) => (
            <th key={ key }>{val}</th>
        ))}
        </tr>
      </thead>
      <thead />
    </table>
  </div>
);

FeeDetails.propTypes = {
  fee: PropTypes.object.isRequired,
};

export default FeeDetails;
