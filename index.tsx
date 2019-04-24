import * as React from 'react';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';
import get from 'lodash/get';
import Form from './form';

interface FormProviderProps {
  initialValue: object;
  submit: () => void;
  children: React.ReactNode;
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

function createFormProvider(createOptions) {
  const cache = {};
  const [ formData, setFormData ] = React.useState({});
  const FormProvider: React.FC<FormProviderProps> = ({ initialValue, submit, children }) => {
    setFormData(initialValue);
    return <div>{children}</div>
  }

  const fieldsOptions: {} = {} as any;

  const getFieldProps = (
    name: string,
    options: DecodeOption,
  ) => ({
    [fieldsOptions[name].valuePropName || 'value']: formData[name],
    [fieldsOptions[name].trigger || 'onChange']: (e: string | any) => {
      const value = (e && e.target) ? e.target.value : e;
      setFormData(oldValues => {
        const values  = {
          ...oldValues,
           [name]: value,
        };

        cache.currentField = name;
        cache.fieldsTouched[name] = true;
        if (createOptions.onValuesChange) {
            createOptions.onValuesChange({
              [name]: value,
            });
          }

        return values;
      });
    },
    // ['data-__field']: { errors: errors[name] },
    // ['data-__meta']: {
    //   validate: [{
    //     rules: options.rules,
    //   }],
    // },
  });

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
          // onChange: (value) => {
          //   const newData = set(formData, field, value);
          //   setFormData(newData)
          // }
          onChange: onFieldChange(field),
        },
        children
      )
    }
  }

  //  减少因多次render bind function导致的重复渲染。
  const onFieldChange = React.useCallback(
    (field: string) => {
      return (value) => {
        const newData = set(formData, field, value);
        setFormData(newData)
      }
    },
    [],
  );

  const setFieldsValue = ({ ...values }) => setFormData({ ...formData, ...values });

  const getFieldValue = (field) => get(FormData, field);

  return {
    getFieldDecorator,
    getFieldValue,
    FormProvider,
    setFieldsValue
  }
}

export default createFormProvider;