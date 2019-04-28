import * as React from 'react';
import { set, merge }  from 'lodash';

import FormContext from './context';

interface FormProviderProps {
  initialValues: object;
  onSubmit: (data) => void;
  children: React.ReactNode;
}

let fieldCache = {};
let globalCache = {};

const FormProvider: React.FC<FormProviderProps> = ({ initialValues, children, onSubmit }) => {
  const [ formData, setFormData ] = React.useState(initialValues);

  function submit() {
    let a: any = {}
    let data = merge({}, formData);
    Object.keys(fieldCache).forEach(field => {
      const { isTouchedcache , cacheValue } = fieldCache[field];
      if (!isTouchedcache && (cacheValue || cacheValue === null)) {
        set(data, field, cacheValue);
      }
    });
    onSubmit(data);
  }

  //  由于getFieldDecorator是闭包返回Component，优化情况下可能会导致form值没有同步，故而全局变量记录同步。
  function setFields(options: object) {
    const data = merge({},globalCache);
    Object.keys(options).forEach(key => {
      set(data,key, options[key])
    });
    globalCache = data;
    setFormData(data);
  }

  return (
    <FormContext.Provider
      value={{
        formData,
        setFields
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
  fieldCache
}