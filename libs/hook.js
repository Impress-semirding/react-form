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
let isTouchedcache = {};
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
    const { formData, setFormData } = this;
    const orgin = Object.assign({}, formData);
    const newData = set(orgin, key, value);
    setFormData(newData);
}
function useForm(createOptions) {
    //  后面迭代需要支持trigger方式和error等
    function getFieldDecorator(field, options) {
        return (component) => {
            const { props, children } = component;
            const { id, initialValue, rules, valuePropName } = options;
            const { formData, setFormData } = React.useContext(FormContext);
            if (!isTouchedcache[field]) {
                isTouchedcache[field] = false;
            }
            /**
             * 根据isTouch判断是否要更新formdata。如果为false，则使用初始值，不然使用更新后的值.
             * initialValue优先级高于initialValues中的值。
             * 需要考虑batch 更新，需要优化。
             */
            React.useMemo(() => {
                if (!isTouchedcache[field] && initialValue) {
                    setValue.apply({ formData, setFormData }, [field, initialValue]);
                }
                else if (!isTouchedcache[field] && !get(formData, field)) {
                    setValue.apply({ formData, setFormData }, [field, undefined]);
                }
            }, []);
            //  init child value.
            let value;
            if (!isTouchedcache[field] && initialValue) {
                value = initialValue;
            }
            else if (!isTouchedcache[field] && get(formData, field)) {
                value = get(formData, field);
            }
            else if (isTouchedcache[field]) {
                value = get(formData, field);
            }
            else {
                value = undefined;
            }
            const dynamicField = {
                value
            };
            if (valuePropName) {
                dynamicField[valuePropName] = value;
                delete dynamicField.value;
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
                    setValue.apply({ formData, setFormData }, [field, value]);
                };
            }, []);
            return (React.createElement(MemoComponent, Object.assign({ shouldCheckPropsKey: valuePropName ? valuePropName : 'value', renderComponent: component }, props, dynamicField, { id: genField(id || field, createOptions.name), onChange: onFieldChange(field) }), children));
        };
    }
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