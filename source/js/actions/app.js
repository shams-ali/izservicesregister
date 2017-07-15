import api from 'api';
import axios from 'axios';

export const TEST_ACTION = 'TEST_ACTION';

export const TEST_ASYNC_ACTION_START = 'TEST_ASYNC_ACTION_START';
export const TEST_ASYNC_ACTION_ERROR = 'TEST_ASYNC_ACTION_ERROR';
export const TEST_ASYNC_ACTION_SUCCESS = 'TEST_ASYNC_ACTION_SUCCESS';

export const GET_CLIENTS_ASYNC_ACTION_START = 'GET_CLIENTS_ASYNC_ACTION_START';
export const GET_CLIENTS_ASYNC_ACTION_ERROR = 'GET_CLIENTS_ASYNC_ACTION_ERROR';
export const GET_CLIENTS_ASYNC_ACTION_SUCCESS = 'GET_CLIENTS_ASYNC_ACTION_SUCCESS';
// Test action

export function testAction() {
  return {
    type: TEST_ACTION,
  };
}

// Async action example

function testAsyncStart() {
  return {
    type: TEST_ASYNC_ACTION_START,
  };
}

function testAsyncSuccess(data) {
  return {
    type: TEST_ASYNC_ACTION_SUCCESS,
    data,
  };
}

function testAsyncError(error) {
  return {
    type: TEST_ASYNC_ACTION_ERROR,
    error,
  };
}

export function testAsync() {
  return function (dispatch) {
    dispatch(testAsyncStart());

    api.testAsync()
      .then(data => dispatch(testAsyncSuccess(data)))
      .catch(error => dispatch(testAsyncError(error)));
  };
}

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

// Update
