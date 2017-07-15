import React from 'react';
import ClientItem from 'components/Client/ClientItem';
import PropTypes from 'prop-types';

const ClientList = ({ clients, deleteClient }) => {
  return (
    <tbody>
      {clients.map((client, index) =>
        <ClientItem
          key={ index }
          client={ client }
          deleteClient={ deleteClient }
        />
      )}
    </tbody>
  );
};

ClientList.propTypes = {
  clients: PropTypes.object.isRequired,
  deleteClient: PropTypes.func.isRequired,
};

export default ClientList;
