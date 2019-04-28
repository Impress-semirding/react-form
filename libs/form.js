Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var set_1 = require("lodash/set");
var merge_1 = require("lodash/merge");
var context_1 = require("./context");
var fieldCache = {};
exports.fieldCache = fieldCache;
var globalCache = {};
var Form = function (_a) {
    var initialValues = _a.initialValues, children = _a.children, onSubmit = _a.onSubmit;
    var _b = React.useState(initialValues), formData = _b[0], setFormData = _b[1];
    function submit() {
        var a = {};
        var data = merge_1.default({}, formData);
        Object.keys(fieldCache).forEach(function (field) {
            var _a = fieldCache[field], isTouchedcache = _a.isTouchedcache, cacheValue = _a.cacheValue;
            if (!isTouchedcache && (cacheValue || cacheValue === null)) {
                set_1.default(data, field, cacheValue);
            }
        });
        onSubmit(data);
    }
    //  由于getFieldDecorator是闭包返回Component，优化情况下可能会导致form值没有同步，故而全局变量记录同步。
    function setFields(options) {
        var data = merge_1.default({}, globalCache);
        Object.keys(options).forEach(function (key) {
            set_1.default(data, key, options[key]);
        });
        globalCache = data;
        setFormData(data);
    }
    return (React.createElement(context_1.default.Provider, { value: {
            formData: formData,
            setFields: setFields
        } },
        React.createElement("form", { onSubmit: submit }, children)));
};
exports.default = Form;
//# sourceMappingURL=form.js.map