import * as React from 'react';
import set from 'lodash/set';

import FormContext from './context';

interface FormProviderProps {
  initialValues: object;
  onSubmit: (data) => void;
  children: React.ReactNode;
}

let fieldCache = {};
let globalCache = {};

const Form: React.FC<FormProviderProps> = ({ initialValues, children, onSubmit }) => {
  const [ formData, setFormData ] = React.useState(initialValues);

  function submit() {
    let data = Object.assign({}, formData);
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
    const data = Object.assign({},globalCache);
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
      <div>updated</div>
      <form onSubmit={submit}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

export default Form;

export {
  fieldCache
}