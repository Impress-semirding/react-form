Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("./form");
var hook_1 = require("./hook");
exports.useForm = hook_1.default;
var field_1 = require("./field");
exports.Field = field_1.default;
form_1.default.Field = field_1.default;
exports.default = form_1.default;
//# sourceMappingURL=index.js.map