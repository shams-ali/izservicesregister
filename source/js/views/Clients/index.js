/* eslint no-param-reassign: off */
/* eslint no-alert: off */
/* eslint no-confirm: off */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getClientsAsync } from 'actions/app';
import _ from 'lodash';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import FormContainer from 'components/Global/FormContainer';

@connect(state => ({ clients: state.app.get('clients') }))

class Clients extends Component {
  static propTypes = {
    clients: PropTypes.array,
    dispatch: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      addClientActive: false,
    };
    this.questions = {
      dealer: {
        validations: ['required'],
      },
      name: {
        validations: ['required'],
      },
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
    this.deleteClient = this.deleteClient.bind(this);
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

  deleteClient({ target: { value } }) {
    axios.delete(`/api/v1/clients/${ value }`)
      .then(({ data }) => alert('User Deleted Successfully', data))
      .catch(error => alert(error));
    // TODO: force refresh
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
          <tbody>
            {clients.map((client, i) => (
              <tr key={ client.id }>
                <td>{`${ client.name }`}</td>
                <td>{client.dealer}</td>
                <td>{moment(client.created_at).format('h:mmA')}</td>
                <td>
                  <button
                    className='btn btn-primary btn-sm'
                    key={ client.id }
                    id={ client.id }
                    value={ client.id }
                    onClick={ (e) => confirm('Delete Client?') && this.deleteClient(e) }
                  >
                  Delete Client
                </button>
                </td>
                <td>
                  <NavLink
                    to={ `/application/client/${ client.id }/vehicles` }
                    className='btn btn-primary btn-sm'
                    key={ i }
                    id={ `enter${ client.id }` }
                    value={ client.id }
                  >
                  View Vehicles
                </NavLink>
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>

    );
  }
}

export default Clients;
