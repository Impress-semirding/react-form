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
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';
import get from 'lodash/get';
import FormContext from './context';
import { genField } from './utils';
//  根据key优化更新子组件。
const MemoComponent = React.memo((_a) => {
    var { renderComponent, children } = _a, restProps = __rest(_a, ["renderComponent", "children"]);
    console.log(restProps, 'rerender');
    return React.cloneElement(renderComponent, Object.assign({}, restProps), children);
}, (preProps, nextProps) => {
    const { shouldCheckPropsKey } = preProps;
    return isEqual(preProps[shouldCheckPropsKey], nextProps[shouldCheckPropsKey]);
});
function setValue(key, value) {
    const { formData, setFormData } = React.useContext(FormContext);
    const orgin = Object.assign({}, formData);
    const newData = set(orgin, key, value);
    setFormData(newData);
}
function useForm(createOptions) {
    let isTouchedcache = {};
    //  后面迭代需要支持trigger方式和error等
    function getFieldDecorator(field, options) {
        return (component) => {
            const { formData, setFormData } = React.useContext(FormContext);
            const { props, children } = component;
            const { id, initialValue, rules, valuePropName } = options;
            if (!isTouchedcache[field]) {
                isTouchedcache[field] = false;
            }
            //  根据isTouch判断是否要更新formdata。如果为false，则使用初始值，不然使用更新后的值.
            if (!isTouchedcache[field] && initialValue) {
                setValue(field, initialValue);
            }
            else if (!isTouchedcache[field]) {
                setValue(field, undefined);
            }
            const dynamicField = {
                value: get(formData, field)
            };
            if (valuePropName) {
                dynamicField[valuePropName] = get(formData, field);
                delete dynamicField.value;
            }
            return (React.createElement(MemoComponent, Object.assign({ shouldCheckPropsKey: valuePropName ? valuePropName : 'value', renderComponent: component }, props, dynamicField, { id: genField(id || field, createOptions.name), onChange: onFieldChange(field) }), children));
        };
    }
    //  减少因多次render bind function导致的重复渲染。
    const onFieldChange = React.useCallback((field) => {
        return (ev) => {
            let value;
            if (ev.preventDefault) {
                value = ev.target.value;
            }
            else {
                value = ev;
            }
            isTouchedcache[field] = true;
            setValue(field, value);
        };
    }, []);
    const setFieldsValue = (_a) => {
        var values = __rest(_a, []);
        const { formData, setFormData } = React.useContext(FormContext);
        setFormData(Object.assign({}, formData, values));
    };
    const getFieldValue = (field) => {
        const { formData } = React.useContext(FormContext);
        get(FormData, field);
    };
    return {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue
    };
}
export default useForm;
//# sourceMappingURL=hook.js.map