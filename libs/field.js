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
var form_1 = require("./form");
var Field = function (_a) {
    var name = _a.name, initialValue = _a.value, Component = _a.component, children = _a.children;
    var _b = React.useContext(context_1.default), formData = _b.formData, setFields = _b.setFields, setFormData = _b.setFormData;
    if (!form_1.fieldCache[name]) {
        form_1.fieldCache[name] = {};
    }
    var _c = form_1.fieldCache[name], isTouchedcache = _c.isTouchedcache, cacheValue = _c.cacheValue;
    if (!isTouchedcache) {
        form_1.fieldCache[name].isTouchedcache = false;
    }
    //  init child value.
    var value;
    if (!isTouchedcache && initialValue) {
        value = initialValue;
    }
    else if (!isTouchedcache && lodash_1.get(formData, name)) {
        value = lodash_1.get(formData, name);
    }
    else if (isTouchedcache) {
        value = lodash_1.get(formData, name);
    }
    else {
        value = null;
    }
    function onFieldChange(ev) {
        var _a;
        var value;
        if (ev.preventDefault) {
            value = ev.target.value;
        }
        else {
            value = ev;
        }
        if (children.props.onChange) {
            children.props.onChange(value);
        }
        form_1.fieldCache[name].isTouchedcache = true;
        setFields((_a = {}, _a[name] = value, _a));
    }
    if (Component) {
        return (React.createElement("div", null,
            React.createElement(Component, { onChange: onFieldChange, value: value }, children)));
    }
    return (React.createElement("div", null, React.cloneElement(children, __assign({}, children.props, { value: value, onChange: onFieldChange }))));
};
exports.default = Field;
//# sourceMappingURL=field.js.map