import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { routeCodes } from '../../views/App';
import Logo from '../../../assets/img/logo.gif';

export default class Menu extends Component {
  render() {
    return (
      <nav className='navbar navbar-inverse navbar-fixed-top'>
        <div className="container">
          <div className='Menu-links'>
            <a className="navbar-brand" href="#"><img
              src={ Logo }
              alt='Work & Co logo'
            />
            </a>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li className="active">
                  <NavLink
                    activeClassName='Menu-link--active'
                    className='Menu-link'
                    exact
                    to={ routeCodes.DASHBOARD }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName='Menu-link--active'
                    className='Menu-link'
                    to={ routeCodes.ABOUT }
                  >
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName='Menu-link--active'
                    className='Menu-link'
                    to={ routeCodes.APPLICATIONS }
                  >
                    Applications
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    activeClassName='Menu-link--active'
                    className='Menu-link'
                    to='404'
                  >
                    404
                  </NavLink>
                </li>

              </ul>
            </div>

          </div>
        </div>
      </nav>
    );
  }
}
