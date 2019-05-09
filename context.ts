import * as React from 'react';

interface Context {
  formData: object;
  err: object;
  getFormData: () => object;
  setFormData: (params) => void;
  setFields: (params) => void;
}

const FormContext = React.createContext({
  formData: {},
  // getFormData: () => {},
  // setFormData: (params) => {},
  setFields: (params) => {}
} as Context);

export default FormContext;