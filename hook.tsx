import * as React from 'react';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';
import get from 'lodash/get';

import Form from './form';
import FormContext from './context';
import { genField } from './utils';

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

interface MemoProps {
  renderComponent: React.ReactNode;
  children: React.ReactNode;
}

//  根据key优化更新子组件。
const MemoComponent = React.memo(({
  renderComponent,
  children,
  ...restProps
}: any) => {
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

function setValue(key, value) {
  const { formData, setFormData } = React.useContext(FormContext);
  const orgin = Object.assign({}, formData);
  const newData = set(orgin, key, value);
  setFormData(newData)
}

function useForm(createOptions: CreateOption) {
  let isTouchedcache = {};
  //  后面迭代需要支持trigger方式和error等
  function getFieldDecorator(field: string, options: DecodeOption) {
    return (component) => {
      const { formData, setFormData } = React.useContext(FormContext);
      const { props, children } = component;
      const { id, initialValue, rules, valuePropName  } = options;

      if (!isTouchedcache[field]) {
        isTouchedcache[field] = false;
      }

      //  根据isTouch判断是否要更新formdata。如果为false，则使用初始值，不然使用更新后的值.
      if (!isTouchedcache[field] && initialValue) {
        setValue(field, initialValue);
      } else if (!isTouchedcache[field]){
        setValue(field, undefined)
      }

      const dynamicField: any= {
        value: get(formData, field)
      };

      if (valuePropName) {
        dynamicField[valuePropName] = get(formData, field);
        delete dynamicField.value;
      }

      return (
        <MemoComponent
          shouldCheckPropsKey={valuePropName ? valuePropName : 'value'}
          renderComponent={component}
          {...props}
          {...dynamicField}
          id={genField(id || field, createOptions.name)}
          onChange={onFieldChange(field)}
        >
          {children}
        </MemoComponent>
      )
    }
  }

  //  减少因多次render bind function导致的重复渲染。
  const onFieldChange = React.useCallback(
    (field: string) => {
      return (ev) => {
        let value;
        if (ev.preventDefault) {
          value = ev.target.value;
        } else {
          value = ev;
        }
        isTouchedcache[field] = true;
        setValue(field, value);
      }
    },
    [],
  );

  const setFieldsValue = ({ ...values }) => {
    const { formData, setFormData } = React.useContext(FormContext);
    setFormData({ ...formData, ...values });
  }

  const getFieldValue = (field) => {
    const { formData } = React.useContext(FormContext);
    get(FormData, field);
  }

  return {
    getFieldDecorator,
    getFieldValue,
    setFieldsValue
  }
}

export default useForm;