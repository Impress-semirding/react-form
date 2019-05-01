import * as React from 'react';
import { set, merge }  from 'lodash';

import FormContext from './context';
import { fieldCache, initial } from './form';

interface FormFieldProps {
  name: string;
  value: any;
  component?: (props: object) => React.ReactNode;
  render?: React.ReactNode;
  children?: React.ReactNode;
  onChange?: () => void;
  onBlur?: () => void;
}

const Field: React.FC<FormFieldProps> = ({ name, value, component, children }) => {
  const { formData, setFields, setFormData } = React.useContext(FormContext);

  function onFieldChange(ev) {
    let value;
    if (ev.preventDefault) {
      value = ev.target.value;
    } else {
      value = ev;
    }
    fieldCache[name].isTouchedcache = true;
    setFields({ [name]: value });
  }

  if (component) {
    return (
      <div>
        <component onChange={onFieldChange}>
          {children}
        </component>
      </div>
    )
  }

  return (
    <div>
      {children}
    </div>
  )
}

export default Field;
