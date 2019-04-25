var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as React from 'react';
import set from 'lodash/set';
import get from 'lodash/get';
import { genField } from './utils';
let isTouchedcache = {};
function createFormProvider(createOptions) {
    const [formData, setFormData] = React.useState({});
    const FormProvider = ({ initialValue, submit, children }) => {
        setFormData(initialValue);
        return React.createElement("div", null, children);
    };
    const fieldsOptions = {};
    //  后面迭代需要支持trigger方式和error等
    function getFieldDecorator(field, options) {
        return (component) => {
            const { props, children } = component;
            const { id, initialValue, rules, valuePropName } = options;
            if (!isTouchedcache[field]) {
                isTouchedcache[field] = false;
            }
            //  根据isTouch判断是否要更新formdata。如果为false，则使用初始值，不然使用更新后的值.
            if (!isTouchedcache[field] && initialValue) {
                set(formData, field, initialValue);
            }
            else if (!isTouchedcache[field]) {
                set(formData, field, undefined);
            }
            const dynamicField = {
                value: get(formData, field)
            };
            if (valuePropName) {
                dynamicField[valuePropName] = get(formData, field);
                delete dynamicField.value;
            }
            return React.cloneElement(component, Object.assign({}, props, dynamicField, { id: genField(id || field, createOptions.name), onChange: onFieldChange(field, formData) }), children);
        };
    }
    //  减少因多次render bind function导致的重复渲染。
    const onFieldChange = React.useCallback((field, data) => {
        return (ev) => {
            let value;
            if (ev.preventDefault) {
                value = ev.target.value;
            }
            else {
                value = ev;
            }
            const orgin = Object.assign({}, data);
            const newData = set(orgin, field, value);
            isTouchedcache[field] = true;
            setFormData(newData);
        };
    }, []);
    const setFieldsValue = (_a) => {
        var values = __rest(_a, []);
        return setFormData(Object.assign({}, formData, values));
    };
    const getFieldValue = (field) => get(FormData, field);
    return {
        value: formData,
        getFieldDecorator,
        getFieldValue,
        FormProvider,
        setFieldsValue
    };
}
export default createFormProvider;
//# sourceMappingURL=index.js.map