import * as React from 'react';
import FormContext from './context';

interface FormProviderProps {
  initialValue: object;
  onSubmit: () => void;
  children: React.ReactNode;
}

const Form: React.FC<FormProviderProps> = ({ initialValue, onSubmit, children }) => {
  const [ formData, setFormData ] = React.useState({});
  // if (initialValue) {
  //   setFormData(initialValue);
  // }
  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData
      }}
    > 
      {children}
    </FormContext.Provider>
  )
}

export default Form;