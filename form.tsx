import * as React from 'react';
import { set, merge }  from 'lodash';

import FormContext from './context';

interface FormProviderProps {
  initialValues?: object;
  onSubmit: (data) => void;
  children: React.ReactNode;
  validationSchema?: {
    validate: (data) => any;
  };
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

function errorReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'setError':
      return {
        ...state,
        payload
      }
    default:
      throw new Error();
  }
}

const FormProvider: React.FC<FormProviderProps> = ({ initialValues, validationSchema, children, onSubmit }) => {
  const [ formData, dispatch ] = React.useReducer(reducer, initialValues);
  const [ err, eDispatch ] = React.useReducer(errorReducer, initialValues);
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

  function isValid(data) {
    if (validationSchema) {
      validationSchema.validate(data)
        .catch((err) => {
          const { errors, values } = err;
          eDispatch({
            type: 'setError',
            payload: {
              errors,
              values
            }
          })
        })
    }
  }

  function setFormData(payload: object) {
    dispatch({ type: 'all-set', payload });
  }

  //  由于getFieldDecorator是闭包返回Component，优化情况下可能会导致form值没有同步，故而全局变量记录同步。
  function setFields(payload: object) {
    isValid(payload);
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
        err,
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