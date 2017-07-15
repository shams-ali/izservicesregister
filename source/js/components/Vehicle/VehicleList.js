import React from 'react';
import VehicleItem from 'components/Vehicle/VehicleItem';
import PropTypes from 'prop-types';

const VehicleList = ({ vehicles, clientId }) => {
  return (
    <tbody>
      {vehicles.map((vehicle, index) =>
        <VehicleItem
          key={ index }
          vehicle={ vehicle }
          clientId={ clientId }
        />
      )}
    </tbody>
  );
};

VehicleList.propTypes = {
  vehicles: PropTypes.array.isRequired,
  clientId: PropTypes.string,
};

export default VehicleList;
