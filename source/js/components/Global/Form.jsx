/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import React, { PropTypes } from 'react';
import Validation from 'react-validation';
import validator from 'validator';
import _ from 'lodash';

Object.assign(Validation.rules, {
  required: {
    rule: value => value.toString().trim(),
    hint: () => <span className='form-error is-visible'>Required</span>,
  },
  email: {
    rule: value => validator.isEmail(value),
    hint: value => <span className='form-error is-visible'>{value} isnt an Email.</span>,
  },
  zip: {
    rule: value => value.length === 5 || value.length === 0,
    hint: value => <span className='form-error is-visible'>{value} Must be 5 Digits.</span>,
  },
  year: {
    rule: value => value.length === 4 || value.length === 0,
    hint: value => <span className='form-error is-visible'>{value} Must be 4 Digits.</span>,
  },
  api: {
    hint: value => (
      <button className='form-error is-visible'>
        API Error on {value} value. Focus to hide.
      </button>
    ),
  },
});

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      registered: false,
      dobInputType: 'text',
    };
    this.removeApiError = this.removeApiError.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    console.warn('submitting', event.target);
    const data = 'thhits will be data';
    // let data = {
    //   dob: event.target.dob.value,
    //   street: event.target.street.value,
    //   city: event.target.city.value,
    //   state: event.target.state.value,
    //   zip: event.target.zip.value,
    //   income: event.target.income.value,
    //   gender: event.target.gender.value,
    //   race: event.target.race.value,
    //   veteran: event.target.veteran.value,
    //   householdSize: event.target.householdSize.value,
    // };
    // data = JSON.stringify(data);
    this.props.create(data);
  }

  removeApiError() {
    this.form.hideError('username');
  }

  render() {
    return (
      <div className='row'>
        <div className='text-center'>
          <h3>Add A New {this.props.type}</h3>
          <Validation.components.Form ref={ c => { this.form = c; } } onSubmit={ this.props.create }>
            {_.map(this.props.questions, (props, name) => (
              <div key={ name } className='form-group'>
                <Validation.components.Input
                  className='form-control'
                  value={ props.value || '' }
                  placeholder={ name || '' }
                  onFocus={ props.onFocus || '' }
                  name={ name }
                  type={ props.type }
                  validations={ props.validations || [] }
                />
              </div>
            ))}
            <div className='form-group'>
              <Validation.components.Button className='btn btn-default btn-block' >
                Create {this.props.type}
              </Validation.components.Button>
            </div>
          </Validation.components.Form>
        </div>
        <div className='form-group'>
          <button onClick={ this.props.toggleForm } className='btn btn-default btn-block' >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

Form.propTypes = {
  type: PropTypes.string.isRequired,
  create: PropTypes.func.isRequired,
  questions: PropTypes.object.isRequired,
  toggleForm: PropTypes.func.isRequired,
};

export default Form;
