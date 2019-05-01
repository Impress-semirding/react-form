import * as React from 'react';
import { set, merge }  from 'lodash';


import FormContext from './context';

interface FormProviderProps {
  initialValues?: object;
  onSubmit: (data) => void;
  children: React.ReactNode;
}

let fieldCache = {};
let initial = null;

function reducer(state, action) {
  const { type, payload } = action;
  const data = merge({}, state);
  switch (type) {
    case 'set': 
      Object.keys(payload).forEach(key => {
        set(data,key, payload[key])
      });
      return data;
    case 'all-set':
      return payload;
    default:
      throw new Error();
  }
}

const FormProvider: React.FC<FormProviderProps> = ({ initialValues, children, onSubmit }) => {
  const [ formData, dispatch ] = React.useReducer(reducer, initialValues);
  const formRef = React.useRef();
  React.useLayoutEffect(() => {
    formRef.current = formData;
  });

  function submit() {
    let data = merge({}, formData);
    Object.keys(fieldCache).forEach(field => {
      const { isTouchedcache , cacheValue } = fieldCache[field];
      if (!isTouchedcache && (cacheValue || cacheValue === null)) {
        set(data, field, cacheValue);
      }
    });
    onSubmit(data);
  }
  //  formData maybe in closure.so provider getFormData for callback(closure) function.
  function getFormData() {
    return formRef.current;
  }

  function setFormData(payload: object) {
    dispatch({ type: 'all-set', payload });
  }

  //  由于getFieldDecorator是闭包返回Component，优化情况下可能会导致form值没有同步，故而全局变量记录同步。
  function setFields(payload: object) {
    dispatch({ type: 'set', payload });
  }

  //  use by reset resetFields.
  if (!initial) {
    initial = merge({}, initialValues);
  }

  return (
    <FormContext.Provider
      value={{
        formData,
        getFormData,
        setFields,
        setFormData
      }}
    >
      <form onSubmit={submit}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

export default FormProvider;

export {
  fieldCache,
  initial
}