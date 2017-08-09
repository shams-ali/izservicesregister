/* eslint max-len: 0 */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React, { Component } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import ClientItem from 'components/Client/ClientItem';
import VehicleItem from 'components/Vehicle/VehicleItem';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicles: null,
      clients: null,
      valueVIN: '',
      valueName: '',
      valuePlate: '',
      suggestions: [],
    };

    this.getVehicles = this.getVehicles.bind(this);
    this.getVINSuggestions = this.getVINSuggestions.bind(this);
    this.getNameSuggestions = this.getNameSuggestions.bind(this);
    this.getPlateSuggestions = this.getPlateSuggestions.bind(this);
    this.onVINChange = this.onVINChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onPlateChange = this.onPlateChange.bind(this);
    this.onVINSuggestionsFetchRequested = this.onVINSuggestionsFetchRequested.bind(this);
    this.onNameSuggestionsFetchRequested = this.onNameSuggestionsFetchRequested.bind(this);
    this.onPlateSuggestionsFetchRequested = this.onPlateSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.renderVINSuggestion = this.renderVINSuggestion.bind(this);
    this.renderNameSuggestion = this.renderNameSuggestion.bind(this);
    this.renderPlateSuggestion = this.renderPlateSuggestion.bind(this);
  }

  componentDidMount() {
    this.getVehicles();
    this.getClients();
  }

  onVINChange(event, { newValue }) {
    this.setState({ valueVIN: newValue });
  }

  onNameChange(event, { newValue }) {
    this.setState({ valueName: newValue });
  }

  onPlateChange(event, { newValue }) {
    this.setState({ valuePlate: newValue });
  }

  onVINSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getVINSuggestions(value),
    });
  }

  onNameSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getNameSuggestions(value),
    });
  }

  onPlateSuggestionsFetchRequested({ value }) {
    console.log('plate fetch suggestions')

    this.setState({
      suggestions: this.getPlateSuggestions(value),
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  getVINSuggestions(v) {
    const inputValue = v.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.state.vehicles.filter(vehicle =>
      vehicle.vin.toLowerCase().slice(0, inputLength) === inputValue
    );
  }

  getNameSuggestions(v) {
    const inputValue = v.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.state.clients.filter(client =>
      client.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  }

  getPlateSuggestions(v) {
    console.log('plate suggestions')

    const inputValue = v.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.state.vehicles.filter(vehicle =>
      vehicle.plate.toLowerCase().slice(0, inputLength) === inputValue
    );
  }

  getVINSuggestionValue(suggestion) {
    return suggestion.vin;
  }

  getNameSuggestionValue(suggestion) {
    return suggestion.name;
  }

  getPlateSuggestionValue(suggestion) {
    console.log('get plate suggestion v')

    return suggestion.plate;
  }

  getVehicles() {
    axios.get('/api/v1/vehicles')
      .then(({ data: { data } }) => this.setState({ vehicles: data }))
      .catch(err => console.error(err));
  }

  getClients() {
    axios.get('/api/v1/clients')
      .then(({ data: { data } }) => this.setState({ clients: data }))
      .catch(err => console.error(err));
  }

  renderVINSuggestion(suggestion) {
    return (
      <VehicleItem
        vehicle={ suggestion }
        clientId={ suggestion.client.id }
        getVehicles={ this.getVehicles }
      />
    );
  }

  renderNameSuggestion(suggestion) {
    return (
      <ClientItem
        client={ suggestion }
      />
    );
  }

  renderPlateSuggestion(suggestion) {
    console.log('plate suggestion')
    return (
      <VehicleItem
        vehicle={ suggestion }
        clientId={ suggestion.client.id }
        getVehicles={ this.getVehicles }
      />
    );
  }

  render() {
    const { valueVIN, valueName, valuePlate, suggestions } = this.state;
    const inputVINProps = {
      placeholder: 'Type a VIN number',
      value: valueVIN,
      onChange: this.onVINChange,
    };
    const inputNameProps = {
      placeholder: 'Type a Name',
      value: valueName,
      onChange: this.onNameChange,
    };
    const inputPlateProps = {
      placeholder: 'Type a Plate Number',
      value: valuePlate,
      onChange: this.onPlateChange,
    };
    return (
      <div className='row home'>
        <div className='col-md-12'>
          <div className='row'>
            <div className='col-md-12 text-center'>
              <h3>Welcome to the Registration Invoice Generator</h3>
              <h4>Search By VIN Number</h4><br />
              <Autosuggest
                suggestions={ suggestions }
                onSuggestionsFetchRequested={ this.onVINSuggestionsFetchRequested }
                onSuggestionsClearRequested={ this.onSuggestionsClearRequested }
                getSuggestionValue={ this.getVINSuggestionValue }
                renderSuggestion={ this.renderVINSuggestion }
                inputProps={ inputVINProps }
              />
              <h4>Search By Name</h4><br />
              <Autosuggest
                suggestions={ suggestions }
                onSuggestionsFetchRequested={ this.onNameSuggestionsFetchRequested }
                onSuggestionsClearRequested={ this.onSuggestionsClearRequested }
                getSuggestionValue={ this.getNameSuggestionValue }
                renderSuggestion={ this.renderNameSuggestion }
                inputProps={ inputNameProps }
              />
              <h4>Search By Plate</h4><br />
              <Autosuggest
                suggestions={ suggestions }
                onSuggestionsFetchRequested={ this.onPlateSuggestionsFetchRequested }
                onSuggestionsClearRequested={ this.onSuggestionsClearRequested }
                getSuggestionValue={ this.getPlateSuggestionValue }
                renderSuggestion={ this.renderPlateSuggestion }
                inputProps={ inputPlateProps }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
