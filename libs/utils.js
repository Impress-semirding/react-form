Object.defineProperty(exports, "__esModule", { value: true });
function genField(str, prefix) {
    if (prefix && typeof prefix === 'string') {
        return prefix + "-" + str;
    }
    return str;
}
exports.genField = genField;
//# sourceMappingURL=utils.js.map