/* eslint max-len: 0 */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicles: null,
      value: '',
      suggestions: [],
    };

    this.getSuggestions = this.getSuggestions.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
  }

  componentDidMount() {
    this.getVehicles();
  }

  onChange(event, { newValue }) {
    this.setState({ value: newValue });
  }

  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  getSuggestions(v) {
    const inputValue = v.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.state.vehicles.filter(vehicle =>
      vehicle.vin.toLowerCase().slice(0, inputLength) === inputValue
    );
  }

  getSuggestionValue(suggestion) {
    return suggestion.vin;
  }

  getVehicles() {
    axios.get('/api/v1/vehicles')
      .then(({ data: { data } }) => this.setState({ vehicles: data }))
      .catch(err => console.error(err));
  }

  renderSuggestion(suggestion) {
    return (
      <NavLink
        to={ `/application/search/${ suggestion.client.id }/vehicles/` }
      >
        {suggestion.vin}
      </NavLink>
    );
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Type a VIN number',
      value,
      onChange: this.onChange,
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
                onSuggestionsFetchRequested={ this.onSuggestionsFetchRequested }
                onSuggestionsClearRequested={ this.onSuggestionsClearRequested }
                getSuggestionValue={ this.getSuggestionValue }
                renderSuggestion={ this.renderSuggestion }
                inputProps={ inputProps }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
