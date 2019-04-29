import * as React from 'react';

interface Context {
  formData: object;
  setFormData: (params) => void;
  setFields: (params) => void;
}

const FormContext = React.createContext({
  formData: {},
  setFormData: (params) => {},
  setFields: (params) => {}
} as Context);

export default FormContext;