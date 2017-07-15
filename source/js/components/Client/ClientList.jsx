import React from 'react';
import ClientItem from 'components/Client/ClientItem';
import PropTypes from 'prop-types';

const ClientList = ({ clients }) => {
  return (
    <tbody>
      {clients.map((client, index) =>
        <ClientItem
          key={ index }
          client={ client }
        />
      )}
    </tbody>
  );
};

ClientList.propTypes = {
  clients: PropTypes.object.isRequired,
};

export default ClientList;
