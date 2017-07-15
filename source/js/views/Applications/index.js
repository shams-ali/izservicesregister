/* eslint max-len: 0 */

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Applications extends Component {
  constructor(props) {
    super(props);
    this.applications = [
      { link: 'walkin', title: 'Walk-In Application' },
      { link: 'dealer', title: 'Dealer Application' },
      { link: 'chart', title: 'Outstanding Chart' },
    ];
  }

  render() {
    return (
      <div className='row home'>
        <div className='col-md-12'>
          <div className='row'>
            <div className='col-md-12 text-center'>
              <h3>Welcome to the Registration Invoice Generator</h3>

              <h3>What do you need help with?</h3>
              {this.applications.map((application, index) => (
                <div key={ application.title }>
                  <NavLink to={ `application/${ application.link }` } className='btn btn-default btn-lg btn-block' key={ index } >
                    {application.title}
                  </NavLink>
                </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Applications;
