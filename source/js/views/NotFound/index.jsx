import React, { Component } from 'react';
import Logo from '../../../assets/img/not-found.jpg';

export default class NotFound extends Component {
  render() {
    return (
      <div className='NotFound text-center'>
        <h1>Page not found</h1>
        <img src={ Logo } alt={ 'not-found' } />
      </div>
    );
  }
}
