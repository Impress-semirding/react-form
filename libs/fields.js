Object.defineProperty(exports, "__esModule", { value: true });
var createField = /** @class */ (function () {
    function createField() {
        this.field = {};
    }
    createField.prototype.isValid = function (str) {
        if (this.field[str]) {
            throw Error(str + " bind mutiple.");
        }
    };
    createField.prototype.setField = function (str) {
    };
    return createField;
}());
exports.default = createField;
//# sourceMappingURL=fields.js.map