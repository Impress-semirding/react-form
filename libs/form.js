import * as React from 'react';
import set from 'lodash/set';
import FormContext from './context';
let fieldCache = {};
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
    function setFields(options) {
        const data = Object.assign({}, formData);
        Object.keys(options).forEach(key => {
            set(data, key, options[key]);
        });
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