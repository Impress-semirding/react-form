import * as React from 'react';

const FormContext = React.createContext({
  formData: {},
  setFormData: (params) => void
});

export default FormContext;