import * as React from 'react';
import set from 'lodash/set';
import FormContext from './context';
let fieldCache = {};
let globalCache = {};
const Form = ({ initialValues, children, onSubmit }) => {
    const [formData, setFormData] = React.useState(initialValues);
    function submit() {
        let data = Object.assign({}, formData);
        Object.keys(fieldCache).forEach(field => {
            const { isTouchedcache, cacheValue } = fieldCache[field];
            if (!isTouchedcache && (cacheValue || cacheValue === null)) {
                set(data, field, cacheValue);
            }
        });
        onSubmit(data);
    }
    //  由于getFieldDecorator是闭包返回Component，优化情况下可能会导致form值没有同步，故而全局变量记录同步。
    function setFields(options) {
        const data = Object.assign({}, globalCache);
        Object.keys(options).forEach(key => {
            set(data, key, options[key]);
        });
        globalCache = data;
        setFormData(data);
    }
    return (React.createElement(FormContext.Provider, { value: {
            formData,
            setFields
        } },
        React.createElement("div", null, "updated"),
        React.createElement("form", { onSubmit: submit }, children)));
};
export default Form;
export { fieldCache };
//# sourceMappingURL=form.js.map