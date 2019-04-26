import * as React from 'react';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';
import get from 'lodash/get';
import Form from './form';

import { genField } from './utils'

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
  id: string;
  initialValue?: string;
  rules?: Array<Rule>[];
  valuePropName?: string;
}

interface CreateOption {
  name: string; //设置表单域内字段 id 的前缀,
  onFieldsChange: (props: object, fields: any) => void;// field change回调
}

let isTouchedcache = {};

//  根据key优化更新子组件。
const MemoComponent = React.memo(({
  renderComponent,
  children,
  ...restProps
}) => {
  console.log(restProps, 'rerender');
  return React.cloneElement(
    renderComponent, {
      ...restProps,
    },
    children
  )
}, (preProps, nextProps) => {
  const { shouldCheckPropsKey } = preProps;
  return isEqual(preProps[shouldCheckPropsKey], nextProps[shouldCheckPropsKey]);
});

function createFormProvider(createOptions: CreateOption) {
  const [ formData, setFormData ] = React.useState({});
  const FormContext = React.createContext({
    formData: {},
    setFormData: () => {}
  });

  const FormProvider: React.FC<FormProviderProps> = ({ initialValue, onSubmit, children }) => {
    if (initialValue) {
      setFormData(initialValue);
    }
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

  const fieldsOptions: {} = {} as any;

  //  后面迭代需要支持trigger方式和error等
  function getFieldDecorator(field: string, options: DecodeOption) {
    return (component) => {
      const { props, children } = component;
      const { id, initialValue, rules, valuePropName  } = options;

      if (!isTouchedcache[field]) {
        isTouchedcache[field] = false;
      }

      //  根据isTouch判断是否要更新formdata。如果为false，则使用初始值，不然使用更新后的值.
      if (!isTouchedcache[field] && initialValue) {
        set(formData, field, initialValue);
      } else if (!isTouchedcache[field]){
        set(formData, field, undefined);
      }

      const dynamicField: any= {
        value: get(formData, field)
      };

      if (valuePropName) {
        dynamicField[valuePropName] = get(formData, field);
        delete dynamicField.value;
      }

      return (
        <FormContext.Consumer>
          {({ formData, setFormData }) => (
            <MemoComponent
              shouldCheckPropsKey={valuePropName ? valuePropName : 'value'}
              renderComponent={component}
              {...props}
              {...dynamicField}
              id={genField(id || field, createOptions.name)}
              onChange={onFieldChange(field, formData)}
            >
              {children}
            </MemoComponent>
          )}
        </FormContext.Consumer>
      )
    //  每当form中一个field变化，都会导致所有getFieldDecorator绑定的组件更新，不太好.
    //   return React.cloneElement(
    //     component, {
    //       ...props,
    //       ...dynamicField,
    //       id : genField(id || field, createOptions.name),
    //       onChange: onFieldChange(field, formData),
    //     },
    //     children
    //   )
    // }
    }
  }

  //  减少因多次render bind function导致的重复渲染。
  const onFieldChange = React.useCallback(
    (field: string, data: any) => {
      return (ev) => {
        let value;
        if (ev.preventDefault) {
          value = ev.target.value;
        } else {
          value = ev;
        }
        const orgin = Object.assign({}, data);
        const newData = set(orgin, field, value);
        isTouchedcache[field] = true;

        setFormData(newData)
      }
    },
    [],
  );

  const setFieldsValue = ({ ...values }) => setFormData({ ...formData, ...values });

  const getFieldValue = (field) => get(FormData, field);

  return {
    value: formData,
    getFieldDecorator,
    getFieldValue,
    FormProvider,
    setFieldsValue
  }
}

export default createFormProvider;