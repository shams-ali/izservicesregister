/* eslint max-len: 0 */

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Applications extends Component {
  constructor(props) {
    super(props);
    this.applications = [
      { link: 'application', title: 'Application' },
      { link: 'summary', title: 'Summary' },
      // { link: 'chart', title: 'Outstanding Chart' },
      { link: 'search', title: 'Search' },
    ];
  }

  render() {
    return (
      <div className='row home'>
        <div className='col-md-12'>
          <div className='row'>
            <div className='col-md-12 text-center'>
              <h3>Welcome to the Registration Invoice Generator</h3>
              <h4>What do you need help with?</h4><br />
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
