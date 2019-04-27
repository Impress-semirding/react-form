import * as React from 'react';
import FormContext from './context';

interface FormProviderProps {
  initialValues: object;
  onSubmit: (data) => void;
  children: React.ReactNode;
}

const Form: React.FC<FormProviderProps> = ({ initialValues, children, onSubmit }) => {
  const [ formData, setFormData ] = React.useState(initialValues);

  function submit() {
    onSubmit(formData);
  }

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData
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