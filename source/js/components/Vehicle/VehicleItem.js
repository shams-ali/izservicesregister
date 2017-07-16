/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint no-alert: off */
/* eslint no-confirm: off */

import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';

const deleteVehicle = ({ target: { value } }) =>
  axios.delete(`/api/v1/vehicles/${ value }`)
    .then(({ data }) => alert('User Deleted Successfully', data))
    .catch(error => alert(error));

const VehicleItem = ({ vehicle, clientId }) => (
  <tr key={ vehicle.id }>
    <td>{`${ vehicle.make }`}</td>
    <td>{vehicle.model_year}</td>
    <td>{moment(vehicle.exp_date).format('MMMM Do YYYY')}</td>
    <td>{vehicle.vin}</td>
    <td>
      <button
        className='btn btn-primary btn-sm'
        key={ vehicle.id }
        id={ vehicle.id }
        value={ vehicle.id }
        onClick={ (e) => confirm('Delete Vehicle?') && deleteVehicle(e) }
      >
      Delete Vehicle
    </button>
    </td>
    <td>
      <NavLink
        to={ `/application/client/${ clientId }/vehicles/${ vehicle.id }/fees` }
        className='btn btn-primary btn-sm'
        id={ `${ vehicle.id }` }
        value={ vehicle.id }
      >
      View Fees
    </NavLink>
    </td>
    <td>
      <NavLink
        to={ `/application/client/${ clientId }/vehicles/${ vehicle.id }/payments` }
        className='btn btn-primary btn-sm'
        id={ `${ vehicle.id }` }
        value={ vehicle.id }
      >
        View Payments
      </NavLink>
    </td>
    <td>
      <NavLink
        to={ `/receipt/${ vehicle.id }` }
        className='btn btn-primary btn-sm'
        id={ `${ vehicle.id }` }
        value={ vehicle.id }
      >
      Get Reciept
    </NavLink>
    </td>
  </tr>
);

VehicleItem.propTypes = {
  vehicle: PropTypes.object,
  clientId: PropTypes.number,
};

export default VehicleItem;
