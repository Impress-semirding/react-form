export default class createField {
    constructor() {
        this.field = {};
    }
    isValid(str) {
        if (this.field[str]) {
            throw Error(`${str} bind mutiple.`);
        }
    }
    setField(str) {
    }
}
//# sourceMappingURL=fields.js.map