import * as React from 'react';

interface Context {
  formData: object;
  setFormData: (params) => void;
}

const FormContext = React.createContext({
  formData: {},
  setFormData: (params) => {}
} as Context);

export default FormContext;