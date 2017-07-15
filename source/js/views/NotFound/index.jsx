import React, { Component } from 'react';

export default class NotFound extends Component {
  render() {
    return (
      <div className='NotFound text-center'>
        <h1>Page not found</h1>
        <img src='./assets/img/not-found.jpg' alt={ 'not-found' } />
      </div>
    );
  }
}
