/* eslint no-param-reassign: off */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getClientsAsync } from 'actions/client';
import _ from 'lodash';
import { connect } from 'react-redux';
import FormContainer from 'components/Global/FormContainer';
import ClientList from 'components/Client/ClientList';

@connect(state => ({ clients: state.client.get('clients') }))

class Clients extends Component {
  static propTypes = {
    clients: PropTypes.array,
    dispatch: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      addClientActive: false,
    };
    this.questions = {
      dealer: {},
      name: {},
      phone: {},
      email: {},
      dl: {},
      address: {},
      city: {},
      state: {},
      zip: {
        validations: ['zip'],
      },
    };

    this.createClient = this.createClient.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getClientsAsync('/api/v1/clients'));
  }

  createClient(e) {
    const data = _.reduce(e.target, (memo, value) => {
      memo[value.name] = value.value;
      return memo;
    }, {});
    JSON.stringify(data);
    axios.post('/api/v1/clients', data)
      .then(response => console.warn('saved successfully', response))
      .catch(error => console.error(error));
  }

  toggleForm() {
    this.setState({ addClientActive: !this.state.addClientActive });
  }

  render() {
    const { clients } = this.props;
    return (
      <div>
        {this.state.addClientActive ?
          <FormContainer
            type='Client'
            create={ this.createClient }
            questions={ this.questions }
            toggleForm={ this.toggleForm }
          /> : <button className='btn btn-default pull-right' onClick={ this.toggleForm }>Add a new client</button>
        }
        <table className='table table-condensed'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Dealer</th>
              <th>Created At</th>
              <th />
              <th />
            </tr>
          </thead>
          <ClientList
            clients={ clients }
          />
        </table>
      </div>

    );
  }
}

export default Clients;
