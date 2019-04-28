import * as React from 'react';
import set from 'lodash/set';

import FormContext from './context';

interface FormProviderProps {
  initialValues: object;
  onSubmit: (data) => void;
  children: React.ReactNode;
}

let fieldCache = {};

const Form: React.FC<FormProviderProps> = ({ initialValues, children, onSubmit }) => {
  const [ formData, setFormData ] = React.useState(initialValues);

  function submit() {
    let data = Object.assign({}, formData);
    Object.keys(fieldCache).forEach(field => {
      const { isTouchedcache , cacheValue } = fieldCache[field];
      if (!isTouchedcache && (cacheValue || cacheValue === null)) {
        set(data, field, cacheValue);
      }
    });
    onSubmit(data);
  }

  function setFields(options: object) {
    const data = Object.assign({},formData);
    Object.keys(options).forEach(key => {
      set(data,key, options[key])
    });
    setFormData(data);
  }

  return (
    <FormContext.Provider
      value={{
        formData,
        setFields
      }}
    >
      <div>updated</div>
      <form onSubmit={submit}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

export default Form;

export {
  fieldCache
}