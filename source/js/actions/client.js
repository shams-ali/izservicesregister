import api from 'api';
import axios from 'axios';

export const GET_CLIENTS_ASYNC_ACTION_START = 'GET_CLIENTS_ASYNC_ACTION_START';
export const GET_CLIENTS_ASYNC_ACTION_ERROR = 'GET_CLIENTS_ASYNC_ACTION_ERROR';
export const GET_CLIENTS_ASYNC_ACTION_SUCCESS = 'GET_CLIENTS_ASYNC_ACTION_SUCCESS';

// clients
function getClientsAsyncStart() {
  return {
    type: GET_CLIENTS_ASYNC_ACTION_START,
  };
}

function getClientsAsyncSuccess(data) {
  return {
    type: GET_CLIENTS_ASYNC_ACTION_SUCCESS,
    data,
  };
}

function getClientsAsyncError(error) {
  return {
    type: GET_CLIENTS_ASYNC_ACTION_ERROR,
    error,
  };
}

export function getClientsAsync(url) {
  return function (dispatch) {
    dispatch(getClientsAsyncStart());

    axios.get(url)
      .then(({ data: { data } }) => dispatch(getClientsAsyncSuccess(data)))
      .catch(error => dispatch(getClientsAsyncError(error)));
  };
}
