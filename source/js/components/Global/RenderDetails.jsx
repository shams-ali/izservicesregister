import React, { PropTypes } from 'react';
import _ from 'lodash';

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
            <th key={ key }>{val}</th>
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
