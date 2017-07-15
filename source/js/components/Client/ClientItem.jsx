/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint no-alert: off */
/* eslint no-confirm: off */

import React from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import axios from 'axios';

const deleteClient = ({ target: { value } }) =>
  axios.delete(`/api/v1/clients/${ value }`)
    .then(({ data }) => alert('User Deleted Successfully', data))
    .catch(error => alert(error));

const ClientItem = ({ client }) => (
  <tr key={ client.id }>
    <td>{`${ client.name }`}</td>
    <td>{client.dealer}</td>
    <td>{moment(client.created_at).format('MMMM Do YYYY')}</td>
    <td>
      <button
        className='btn btn-primary btn-sm'
        key={ client.id }
        id={ client.id }
        value={ client.id }
        onClick={ (e) => confirm('Delete Client?') && deleteClient(e) }
      >
      Delete Client
    </button>
    </td>
    <td>
      <NavLink
        to={ `/application/client/${ client.id }/vehicles` }
        className='btn btn-primary btn-sm'
        id={ `${ client.id }` }
        value={ client.id }
      >
      View Vehicles
    </NavLink>
    </td>
  </tr>
);

ClientItem.propTypes = {
  client: PropTypes.object.isRequired,
};

export default ClientItem;
