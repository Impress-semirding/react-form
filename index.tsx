import * as React from 'react';
import Form from './form';

interface FormProviderProps {
  value: object;
  children: React.children;
}

function createFormProvider() {
  const FormContext = React.createContext({});
  const [ formData, setFormData ] = React.useState({});
  const FormProvider: React.FC<FormProviderProps> = ({ formId, value, submit, children }) => {
    <FormContext.Provider value={formId}>
      {children}
    </FormContext.Provider>
  }

  //  正在考虑是否需要支持property. => observer children form.
  function observer(component) {
    const { props, children } = component;
    return React.cloneElement(
      component, {
        ...props,
        onChange: (value) => {
          setFormData({ ...formData, ...value })
        }
      },
      children
    )
  }

  return {
    observer,
    FormProvider
  }
}

export default createFormProvider;