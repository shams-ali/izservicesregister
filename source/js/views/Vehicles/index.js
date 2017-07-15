/* eslint no-param-reassign: off */
/* eslint no-alert: off */
/* eslint no-confirm: off */
/* eslint max-len: ["error", 200] */

import React, { PropTypes, Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import FormContainer from 'components/Global/FormContainer';

class Vehicles extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vehicles: [],
      formActive: false,
    };
    this.questions = {
      vin: {
        validations: ['required'],
      },
      plate: {},
      make: {},
      model_year: {
        validations: ['year'],
      },
      exp_date: {},
      engine: {},
      case_type: {},
      case_status: {},
      comment: {},
    };
    this.createVehicle = this.createVehicle.bind(this);
    this.deleteVehicle = this.deleteVehicle.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
  }

  componentDidMount() {
    this.getVehicles();
  }

  getVehicles() {
    axios.get(`/api/v1/vehicles?client_id=${ this.props.match.params.client_id }`)
      .then(({ data: { data } }) => this.setState({ vehicles: data }))
      .catch((error) => console.error(error));
  }

  createVehicle(e) {
    const data = _.reduce(e.target, (memo, value) => {
      memo[value.name] = value.value;
      return memo;
    }, {});
    data.client_id = this.props.match.params.client_id;
    JSON.stringify(data);
    axios.post('/v1/vehicles', data)
      .then(response => console.warn('saved successfully', response))
      .catch(error => console.error(error));
  }

  deleteVehicle({ target: { value } }) {
    axios.delete(`/api/v1/vehicles/${ value }`)
      .then(({ data }) => alert('User Deleted Successfully', data))
      .catch(error => alert(error));
    // TODO: force refresh
  }

  toggleForm() {
    this.setState({ formActive: !this.state.formActive });
  }

  render() {
    return (
      <div>
        <table className='table table-condensed'>
          <thead>
            <tr>
              <th>Make</th>
              <th>Model_Year</th>
              <th>Expiration</th>
              <th>VIN</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {this.state.vehicles.map((vehicle, i) => (
              <tr key={ vehicle.id }>
                <td>{`${ vehicle.make }`}</td>
                <td>{vehicle.model_year}</td>
                <td>{vehicle.exp_date}</td>
                <td>{vehicle.vin}</td>
                <td>
                  <button
                    className='btn btn-primary btn-sm'
                    key={ vehicle.id }
                    id={ vehicle.id }
                    value={ vehicle.id }
                    onClick={ (e) => confirm('Delete Vehicle?') && this.deleteVehicle(e) }
                  >
                  Delete Vehicle
                </button>
                </td>
                <td>
                  <NavLink
                    to={ `/application/client/${ this.props.match.params.client_id }/vehicles/${ vehicle.id }/fees` }
                    className='btn btn-primary btn-sm'
                    key={ i }
                    id={ `enter${ vehicle.id }` }
                    value={ vehicle.id }
                  >
                  View Fees
                </NavLink>
                </td>
                <td>
                  <NavLink
                    to={ `/application/client/${ this.props.match.params.client_id }/vehicles/${ vehicle.id }/payments` }
                    className='btn btn-primary btn-sm'
                    id={ `enter${ vehicle.id }` }
                    value={ vehicle.id }
                  >
                    View Payments
                  </NavLink>
                </td>
                <td>
                  <NavLink
                    to={ `/receipt/${ vehicle.id }` }
                    className='btn btn-primary btn-sm'
                    id={ `enter${ vehicle.id }` }
                    value={ vehicle.id }
                  >
                  Get Reciept
                </NavLink>
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
        {this.state.formActive ?
          <FormContainer
            type='Vehicle'
            create={ this.createVehicle }
            questions={ this.questions }
            toggleForm={ this.toggleForm }
          /> : <button onClick={ this.toggleForm }>Add A New Vehicle</button>
        }
      </div>
    );
  }
}

Vehicles.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Vehicles;
