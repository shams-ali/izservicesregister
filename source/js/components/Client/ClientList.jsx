import React from 'react';
import ClientItem from 'components/Client/ClientItem';
import PropTypes from 'prop-types';

const ClientList = ({ clients, dispatch }) => {
  return (
    <tbody>
      {clients.map((client, index) =>
        <ClientItem
          key={ index }
          client={ client }
          dispatch={ dispatch }
        />
      )}
    </tbody>
  );
};

ClientList.propTypes = {
  clients: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
};

export default ClientList;
