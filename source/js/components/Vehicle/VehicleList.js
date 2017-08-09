import React from 'react';
import VehicleItem from 'components/Vehicle/VehicleItem';
import PropTypes from 'prop-types';

const VehicleList = ({ vehicles, clientId, toggleDetails, getVehicles }) => {
  return (
    <tbody>
      {vehicles.map((vehicle, index) =>
        <VehicleItem
          key={ index }
          vehicle={ vehicle }
          clientId={ clientId }
          toggleDetails={ toggleDetails }
          getVehicles={ getVehicles }
        />
      )}
    </tbody>
  );
};

VehicleList.propTypes = {
  vehicles: PropTypes.array.isRequired,
  clientId: PropTypes.number.isRequired,
  toggleDetails: PropTypes.func.isRequired,
  getVehicles: PropTypes.func.isRequired,
};

export default VehicleList;
