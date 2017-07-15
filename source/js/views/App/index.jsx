import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import Dashboard from 'views/Dashboard';
import About from 'views/About';
import Applications from 'views/Applications';
import Clients from 'views/Clients';
import Vehicles from 'views/Vehicles';
import Fees from 'views/Fees';
import Payments from 'views/Payments';
import Receipt from 'views/Receipt';
import NotFound from 'views/NotFound';
import Menu from 'components/Global/Menu';

const publicPath = '/';

export const routeCodes = {
  DASHBOARD: publicPath,
  ABOUT: `${ publicPath }about`,
  APPLICATIONS: `${ publicPath }applications`,
  CLIENTS: `${ publicPath }application/:type`,
  VEHICLES: `${ publicPath }application/:type/:client_id/vehicles`,
  FEES: `${ publicPath }application/:type/:client_id/vehicles/:vehicle_id/fees`,
  PAYMENTS: `${ publicPath }application/:type/:client_id/vehicles/:vehicle_id/payments`,
  RECEIPT: `${ publicPath }receipt/:id`,
};

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object,
  }

  render() {
    return (
      <BrowserRouter>
        <div className='App'>
          <Menu />
          <div className='Page'>
            <Switch>
              <Route exact path={ publicPath } component={ Dashboard } />
              <Route path={ routeCodes.ABOUT } component={ About } />
              <Route exact path={ routeCodes.APPLICATIONS } component={ Applications } />
              <Route exact path={ routeCodes.CLIENTS } component={ Clients } />
              <Route exact path={ routeCodes.VEHICLES } component={ Vehicles } />
              <Route exact path={ routeCodes.FEES } component={ Fees } />
              <Route exact path={ routeCodes.PAYMENTS } component={ Payments } />
              <Route exact path={ routeCodes.RECEIPT } component={ Receipt } />
              <Route path='*' component={ NotFound } />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
