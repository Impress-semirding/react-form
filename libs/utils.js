function genField(str, prefix) {
    if (prefix && typeof prefix === 'string') {
        return `${prefix}-${str}`;
    }
    return str;
}
export { genField };
//# sourceMappingURL=utils.js.map