/* eslint no-param-reassign: off */
/* eslint no-alert: off */
/* eslint no-confirm: off */

import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import FormContainer from 'components/Global/FormContainer';

class Clients extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      vehicles: {},
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
    this.getClients = this.getClients.bind(this);
    this.createClient = this.createClient.bind(this);
    this.deleteClient = this.deleteClient.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
  }

  componentDidMount() {
    this.getClients();
  }

  getClients() {
    axios.get('/api/v1/clients')
      .then(({ data: { data } }) => this.setState({ clients: data }))
      .catch((error) => console.error(error));
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
    return (
      <div>
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
            {this.state.clients.map((client, i) => (
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
        {this.state.addClientActive ?
          <FormContainer
            type='Client'
            create={ this.createClient }
            questions={ this.questions }
            toggleForm={ this.toggleForm }
          /> : <button onClick={ this.toggleForm }>Add a new client</button>
        }
      </div>

    );
  }
}

export default Clients;
