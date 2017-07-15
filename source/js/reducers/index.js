import { combineReducers } from 'redux';
import app from 'reducers/app';
import client from 'reducers/client';

export default combineReducers({
  app,
  client,
});
