/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';

const ClientItem = ({ client, deleteClient }) => (
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
  deleteClient: PropTypes.func.isRequired,
};

export default ClientItem;
