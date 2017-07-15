import { Map, List } from 'immutable';

import {
  GET_CLIENTS_ASYNC_ACTION_START,
  GET_CLIENTS_ASYNC_ACTION_ERROR,
  GET_CLIENTS_ASYNC_ACTION_SUCCESS,
} from 'actions/client';

const initialState = Map({
  clientsLoading: false,
  clientsError: null,
  clients: new List(),
});

const actionsMap = {
  // client async action
  [GET_CLIENTS_ASYNC_ACTION_START]: (state) => {
    return state.merge({
      clientsLoading: true,
      clientsError: null,
    });
  },
  [GET_CLIENTS_ASYNC_ACTION_ERROR]: (state, action) => {
    return state.merge({
      clientsLoading: false,
      clientsError: action.data,
    });
  },
  [GET_CLIENTS_ASYNC_ACTION_SUCCESS]: (state, action) => {
    return state.merge({
      clientsLoading: false,
      clients: new List(action.data),
    });
  },

};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
