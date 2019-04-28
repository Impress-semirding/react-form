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
import get from 'lodash/get';
import { fieldCache } from './form';
import FormContext from './context';
import { genField } from './utils';
let createOptions = {};
//  根据key优化更新子组件。
const MemoComponent = React.memo((_a) => {
    var { renderComponent, children } = _a, restProps = __rest(_a, ["renderComponent", "children"]);
    console.log(restProps, 'rerender');
    return React.cloneElement(renderComponent, Object.assign({}, restProps), children);
}, (preProps, nextProps) => {
    const { shouldCheckPropsKey } = preProps;
    return isEqual(preProps[shouldCheckPropsKey], nextProps[shouldCheckPropsKey]);
});
function useForm(createOptions) {
    createOptions = createOptions;
}
//  后面迭代需要支持trigger方式和error等
function getFieldDecorator(field, options) {
    return (component) => {
        const { props, children } = component;
        const { id, initialValue, rules, valuePropName } = options;
        const { formData, setFields } = React.useContext(FormContext);
        if (!fieldCache[field]) {
            fieldCache[field] = {};
        }
        const { isTouchedcache, cacheValue } = fieldCache[field];
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
            }
            else if (!isTouchedcache && !get(formData, field)) {
                fieldCache[field].cacheValue = null;
            }
        }, []);
        //  init child value.
        let value;
        if (!isTouchedcache && initialValue) {
            value = initialValue;
        }
        else if (!isTouchedcache && get(formData, field)) {
            value = get(formData, field);
        }
        else if (isTouchedcache) {
            value = get(formData, field);
        }
        else {
            value = null;
        }
        const dynamicField = {
            value
        };
        if (valuePropName) {
            dynamicField[valuePropName] = value;
            delete dynamicField.value;
        }
        const onFieldChange = (field) => {
            return (ev) => {
                let value;
                if (ev.preventDefault) {
                    value = ev.target.value;
                }
                else {
                    value = ev;
                }
                fieldCache[field].isTouchedcache = true;
                //  由于MemoComponent绑定的函数还处于栈中，formData也就还是旧的那个，故而不会更新，所以用全局变量替代。
                setFields({ [field]: value });
            };
        };
        return (React.createElement(MemoComponent, Object.assign({ shouldCheckPropsKey: valuePropName ? valuePropName : 'value', renderComponent: component }, props, dynamicField, { id: genField(id || field, createOptions.name), onChange: onFieldChange(field) }), children));
    };
}
const setFieldsValue = (values) => {
    const { formData, setFields } = React.useContext(FormContext);
    setFields(values);
};
const getFieldValue = (field) => {
    const { formData } = React.useContext(FormContext);
    return get(formData, field);
};
const getFieldValues = () => {
    const { formData } = React.useContext(FormContext);
    return formData;
};
const hooks = {
    useForm,
    getFieldDecorator,
    setFieldsValue,
    getFieldValues,
    getFieldValue
};
export default hooks;
//# sourceMappingURL=hook.js.map