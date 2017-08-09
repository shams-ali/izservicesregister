/* eslint no-param-reassign: off */
/* eslint no-alert: off */
/* eslint no-confirm: off */
/* eslint max-len: ["error", 200] */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React, { PropTypes, Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import FormContainer from 'components/Global/FormContainer';
import VehicleList from 'components/Vehicle/VehicleList';
import RenderDetails from 'components/Global/RenderDetails';

class Vehicles extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vehicles: [],
      formActive: false,
      detailsActive: false,
      vehicle: null,
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
      exp_date: {
        type: 'date',
        onFocus: true,
      },
      engine: {},
      case_type: {},
      case_status: {},
      comment: {},
    };

    this.createVehicle = this.createVehicle.bind(this);
    this.getVehicles = this.getVehicles.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  componentDidMount() {
    this.getVehicles();
  }

  getVehicles() {
    axios.get(`/api/v1/vehicles?client_id=${ this.props.match.params.clientId }`)
      .then(({ data: { data } }) => this.setState({ vehicles: data }))
      .catch((error) => console.error(error));
  }

  createVehicle(e) {
    const data = _.reduce(e.target, (memo, value) => {
      memo[value.name] = value.value;
      return memo;
    }, {});
    data.client_id = this.props.match.params.clientId;

    axios.post('/api/v1/vehicles', data)
      .then(() => this.getVehicles())
      .catch(error => console.error(error));
  }

  toggleForm() {
    this.setState({ formActive: !this.state.formActive });
  }
  toggleDetails(vehicle) {
    this.setState({ detailsActive: true, vehicle });
  }

  render() {
    const { vehicles, formActive, vehicle, detailsActive } = this.state;
    return (
      <div>
        {formActive ?
          <FormContainer
            type='Vehicle'
            create={ this.createVehicle }
            questions={ this.questions }
            toggleForm={ this.toggleForm }
          /> : <button className='btn btn-default pull-right' onClick={ this.toggleForm }>Add A New Vehicle</button>
        }
        <table className='table table-condensed'>
          <thead>
            <tr>
              <th>Make</th>
              <th>Model_Year</th>
              <th>Expiration</th>
              <th>VIN</th>
              <th />
              <th />
              <th />
              <th />
            </tr>
          </thead>
          <VehicleList
            vehicles={ vehicles }
            clientId={ +this.props.match.params.clientId }
            toggleDetails={ this.toggleDetails }
            getVehicles={ this.getVehicles }
          />
        </table>
        {detailsActive &&
          <RenderDetails
            data={ _.omit(vehicle, 'client') }
          />
        }
      </div>
    );
  }
}

Vehicles.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Vehicles;
