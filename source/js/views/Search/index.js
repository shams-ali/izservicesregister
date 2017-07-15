/* eslint max-len: 0 */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import ClientItem from 'components/Client/ClientItem';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicles: null,
      clients: null,
      valueVIN: '',
      valueName: '',
      suggestions: [],
    };

    this.getVINSuggestions = this.getVINSuggestions.bind(this);
    this.getNameSuggestions = this.getNameSuggestions.bind(this);
    this.onVINChange = this.onVINChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onVINSuggestionsFetchRequested = this.onVINSuggestionsFetchRequested.bind(this);
    this.onNameSuggestionsFetchRequested = this.onNameSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
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

  getVINSuggestionValue(suggestion) {
    return suggestion.vin;
  }

  getNameSuggestionValue(suggestion) {
    return suggestion.name;
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
      <NavLink
        to={ `/application/search/${ suggestion.client.id }/vehicles/` }
      >
        {suggestion.vin}
      </NavLink>
    );
  }

  renderNameSuggestion(suggestion) {
    return (
      <ClientItem
        client={ suggestion }
      />
    );
  }

  render() {
    const { valueVIN, valueName, suggestions } = this.state;
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
