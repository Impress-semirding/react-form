var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var isEqual_1 = require("lodash/isEqual");
var get_1 = require("lodash/get");
var form_1 = require("./form");
var context_1 = require("./context");
var utils_1 = require("./utils");
var createOptions = {};
//  根据key优化更新子组件。
var MemoComponent = React.memo(function (_a) {
    var renderComponent = _a.renderComponent, children = _a.children, restProps = __rest(_a, ["renderComponent", "children"]);
    console.log(restProps, 'rerender');
    return React.cloneElement(renderComponent, __assign({}, restProps), children);
}, function (preProps, nextProps) {
    var shouldCheckPropsKey = preProps.shouldCheckPropsKey;
    return isEqual_1.default(preProps[shouldCheckPropsKey], nextProps[shouldCheckPropsKey]);
});
function useForm(createOptions) {
    createOptions = createOptions;
}
//  后面迭代需要支持trigger方式和error等
function getFieldDecorator(field, options) {
    return function (component) {
        var props = component.props, children = component.children;
        var id = options.id, initialValue = options.initialValue, rules = options.rules, valuePropName = options.valuePropName;
        var _a = React.useContext(context_1.default), formData = _a.formData, setFields = _a.setFields;
        if (!form_1.fieldCache[field]) {
            form_1.fieldCache[field] = {};
        }
        var _b = form_1.fieldCache[field], isTouchedcache = _b.isTouchedcache, cacheValue = _b.cacheValue;
        if (!isTouchedcache) {
            form_1.fieldCache[field].isTouchedcache = false;
        }
        /**
         * 根据isTouch判断是否要更新formdata。如果为false，则使用初始值，不然使用更新后的值.
         * initialValue优先级高于initialValues中的值。
         * 需要考虑batch 更新，需要优化。
         */
        React.useMemo(function () {
            if (!isTouchedcache && initialValue) {
                form_1.fieldCache[field].cacheValue = initialValue;
            }
            else if (!isTouchedcache && !get_1.default(formData, field)) {
                form_1.fieldCache[field].cacheValue = null;
            }
        }, []);
        //  init child value.
        var value;
        if (!isTouchedcache && initialValue) {
            value = initialValue;
        }
        else if (!isTouchedcache && get_1.default(formData, field)) {
            value = get_1.default(formData, field);
        }
        else if (isTouchedcache) {
            value = get_1.default(formData, field);
        }
        else {
            value = null;
        }
        var dynamicField = {
            value: value
        };
        if (valuePropName) {
            dynamicField[valuePropName] = value;
            delete dynamicField.value;
        }
        var onFieldChange = function (field) {
            return function (ev) {
                var _a;
                var value;
                if (ev.preventDefault) {
                    value = ev.target.value;
                }
                else {
                    value = ev;
                }
                form_1.fieldCache[field].isTouchedcache = true;
                //  由于MemoComponent绑定的函数还处于栈中，formData也就还是旧的那个，故而不会更新，所以用全局变量替代。
                setFields((_a = {}, _a[field] = value, _a));
            };
        };
        return (React.createElement(MemoComponent, __assign({ shouldCheckPropsKey: valuePropName ? valuePropName : 'value', renderComponent: component }, props, dynamicField, { id: utils_1.genField(id || field, createOptions.name), onChange: onFieldChange(field) }), children));
    };
}
var setFieldsValue = function (values) {
    var _a = React.useContext(context_1.default), formData = _a.formData, setFields = _a.setFields;
    setFields(values);
};
var getFieldValue = function (field) {
    var formData = React.useContext(context_1.default).formData;
    return get_1.default(formData, field);
};
var getFieldValues = function () {
    var formData = React.useContext(context_1.default).formData;
    return formData;
};
var hooks = {
    useForm: useForm,
    getFieldDecorator: getFieldDecorator,
    setFieldsValue: setFieldsValue,
    getFieldValues: getFieldValues,
    getFieldValue: getFieldValue
};
exports.default = hooks;
//# sourceMappingURL=hook.js.map