import * as React from 'react';
import { get, set, merge }  from 'lodash';

import FormContext from './context';
import { fieldCache, initial } from './form';

interface FormFieldProps {
  name: string;
  value: any;
  component?: any;
  render?: React.ReactElement;
  children?: React.ReactElement;
  onChange?: () => void;
  onBlur?: () => void;
}

const Field: React.FC<FormFieldProps> = ({ name, value: initialValue, component: Component, children }) => {
  const { formData, setFields, setFormData } = React.useContext(FormContext);

  if (!fieldCache[name]) {
    fieldCache[name] = {};
  }
  const { isTouchedcache , cacheValue } = fieldCache[name];

  if (!isTouchedcache) {
    fieldCache[name].isTouchedcache = false;
  }

  //  init child value.
  let value;
  if (!isTouchedcache && initialValue) {
    value = initialValue;
  } else if (!isTouchedcache && get(formData, name)){
    value = get(formData, name);
  } else if (isTouchedcache){
    value = get(formData, name);
  } else {
    value = null;
  }

  function onFieldChange(ev) {
    let value;
    if (ev.preventDefault) {
      value = ev.target.value;
    } else {
      value = ev;
    }
    if (children.onChange) {
      children.onChange(value);
    }
    fieldCache[name].isTouchedcache = true;
    setFields({ [name]: value });
  }

  if (Component) {
    return (
      <div>
        <Component onChange={onFieldChange} value={value}>
          {children}
        </Component>
      </div>
    )
  }


  return (
    <div>
      {React.cloneElement(
        children, {
          ...children.props,
          value,
          onChange: onFieldChange
        },
      )}
    </div>
  )
}

export default Field;
