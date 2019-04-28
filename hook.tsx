import * as React from 'react';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';
import get from 'lodash/get';

import { fieldCache } from './form';
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

function useForm(createOptions: CreateOption) {
  const { formData, setFields } = React.useContext(FormContext);
  //  后面迭代需要支持trigger方式和error等
  function getFieldDecorator(field: string, options: DecodeOption) {
    return (component) => {
      const { props, children } = component;
      const { id, initialValue, rules, valuePropName  } = options;
      if (!fieldCache[field]) {
        fieldCache[field] = {};
      }
      const { isTouchedcache , cacheValue } = fieldCache[field];

      if (!isTouchedcache) {
        fieldCache[field].isTouchedcache = false;
      }

      /**
       * 根据isTouch判断是否要更新formdata。如果为false，则使用初始值，不然使用更新后的值.
       * initialValue优先级高于initialValues中的值。
       * 需要考虑batch 更新，需要优化。
       */
      React.useMemo(() => {
        if (!isTouchedcache && initialValue) {
          fieldCache[field].cacheValue = initialValue;
        } else if (!isTouchedcache && !get(formData, field)){
          fieldCache[field].cacheValue = null;
        }
      }, []);

      //  init child value.
      let value;
      if (!isTouchedcache && initialValue) {
        value = initialValue;
      } else if (!isTouchedcache && get(formData, field)){
        value = get(formData, field);
      } else if (isTouchedcache){
        value = get(formData, field);
      } else {
        value = null;
      }

      const dynamicField: any= {
        value
      };

      if (valuePropName) {
        dynamicField[valuePropName] = value;
        delete dynamicField.value;
      }

      //  减少因多次render bind function导致的重复渲染。
      // const onFieldChange = React.useCallback(
      //   (field: string) => {
      //     return (ev) => {
      //       let value;
      //       if (ev.preventDefault) {
      //         value = ev.target.value;
      //       } else {
      //         value = ev;
      //       }
      //       console.log(closureForm)
      //       isTouchedcache[field] = true;
      //       if (field === 'm' || field === 'obj.c[0]') {
      //         closureTest = 1;
      //       }
      //       //  由于MemoComponent绑定的函数还处于栈中，formData也就还是旧的那个，故而不会更新，所以用全局变量替代。
      //       setFields({ [field]: value });
      //     }
      //   },
      //   [],
      // );
      const onFieldChange = (field: string) => {
        return (ev) => {
          let value;
          if (ev.preventDefault) {
            value = ev.target.value;
          } else {
            value = ev;
          }
          fieldCache[field].isTouchedcache = true;
          //  由于MemoComponent绑定的函数还处于栈中，formData也就还是旧的那个，故而不会更新，所以用全局变量替代。
          setFields({ [field]: value });
        }
      }
      
      return React.cloneElement(
        component, {
          ...props,
          ...dynamicField,
          id: genField(id || field, createOptions.name),
          onChange: onFieldChange(field)
        },
        children
      )
    }
  }

  const setFieldsValue = (values) => {
    const { formData, setFields } = React.useContext(FormContext);
    setFields(values);
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