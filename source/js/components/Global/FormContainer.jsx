import React, { PropTypes } from 'react';
import Form from './Form.jsx';

const FormContainer = ({ type, create, questions, toggleForm }) => (
  <div className='row'>
    <div className='col-sm-6 col-sm-offset-3'>
      <Form type={ type } create={ create } questions={ questions } toggleForm={ toggleForm } />
    </div>
  </div>
);

FormContainer.propTypes = {
  type: PropTypes.string.isRequired,
  create: PropTypes.func.isRequired,
  questions: PropTypes.object.isRequired,
  toggleForm: PropTypes.func.isRequired,
};

export default FormContainer;
