import * as React from 'react';
import { set, merge }  from 'lodash';


import FormContext from './context';

interface FormFieldProps {
  name: string;
  value: any;
  component?: (props: object) => React.ReactNode;
  render?: React.ReactNode;
  children?: React.ReactNode;
  onChange?: () => void;
  onBlur?: () => void;
}

const Field: React.FC<FormFieldProps> = ({ initialValues, children, onSubmit }) => {
  const [ formData, setFormData ] = React.useState(initialValues || {});


  return (
    <component>
      {children}
    </component>
  )
}

export default Field;
