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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var lodash_1 = require("lodash");
var context_1 = require("./context");
var fieldCache = {};
exports.fieldCache = fieldCache;
var initial = null;
exports.initial = initial;
function reducer(state, action) {
    var type = action.type, payload = action.payload;
    var data = lodash_1.merge({}, state);
    switch (type) {
        case 'set':
            Object.keys(payload).forEach(function (key) {
                lodash_1.set(data, key, payload[key]);
            });
            return data;
        case 'all-set':
            return payload;
        default:
            throw new Error();
    }
}
function errorReducer(state, action) {
    var type = action.type, payload = action.payload;
    switch (type) {
        case 'setError':
            return __assign({}, state, { payload: payload });
        default:
            throw new Error();
    }
}
var FormProvider = function (_a) {
    var initialValues = _a.initialValues, validationSchema = _a.validationSchema, children = _a.children, onSubmit = _a.onSubmit;
    var _b = React.useReducer(reducer, initialValues), formData = _b[0], dispatch = _b[1];
    var _c = React.useReducer(errorReducer, initialValues), err = _c[0], eDispatch = _c[1];
    var formRef = React.useRef();
    React.useLayoutEffect(function () {
        formRef.current = formData;
    });
    function submit() {
        var data = lodash_1.merge({}, formData);
        Object.keys(fieldCache).forEach(function (field) {
            var _a = fieldCache[field], isTouchedcache = _a.isTouchedcache, cacheValue = _a.cacheValue;
            if (!isTouchedcache && (cacheValue || cacheValue === null)) {
                lodash_1.set(data, field, cacheValue);
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
                .catch(function (err) {
                var errors = err.errors, values = err.values;
                eDispatch({
                    type: 'setError',
                    payload: {
                        errors: errors,
                        values: values
                    }
                });
            });
        }
    }
    function setFormData(payload) {
        dispatch({ type: 'all-set', payload: payload });
    }
    //  由于getFieldDecorator是闭包返回Component，优化情况下可能会导致form值没有同步，故而全局变量记录同步。
    function setFields(payload) {
        isValid(payload);
        dispatch({ type: 'set', payload: payload });
    }
    //  use by reset resetFields.
    if (!initial) {
        exports.initial = initial = lodash_1.merge({}, initialValues);
    }
    return (React.createElement(context_1.default.Provider, { value: {
            formData: formData,
            err: err,
            getFormData: getFormData,
            setFields: setFields,
            setFormData: setFormData
        } },
        React.createElement("form", { onSubmit: submit }, children)));
};
exports.default = FormProvider;
//# sourceMappingURL=form.js.map