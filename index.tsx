import * as React from 'react';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';
import Form from './form';

interface FormProviderProps {
  value: object;
  children: React.children;
}

interface Rule {
  type: string;
  required?: boolean;
  message?: string;
}

interface DecodeOption {
  initialValue?: string;
  rules?: Array<Rule>[];
}

let cache = {};

function createFormProvider() {
  const cache = {};
  const [ formData, setFormData ] = React.useState({});
  const FormProvider: React.FC<FormProviderProps> = ({ initialValue, submit, children }) => {
    setFormData(initialValue);
    return <div>{children}</div>
  }
  //  正在考虑是否需要支持property. => observer children form.
  function getFieldDecorator(field: string, options: DecodeOption) {
    return (component) => {
      const { props, children } = component;
      const { initialValue, rules } = options;

      //  change state and not rerender.
      if (initialValue) {
        set(formData, field, initialValue);
      } else {
        set(formData, field, undefined);
      }

      return React.cloneElement(
        component, {
          ...props,
          value: formData[field],
          onChange: (value) => {
            const newData = set(formData, field, value);
            setFormData(newData)
          }
        },
        children
      )
    }
  }

  return {
    getFieldDecorator,
    FormProvider
  }
}

export default createFormProvider;