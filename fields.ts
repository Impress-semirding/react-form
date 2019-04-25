export default class createField {
  field: {};
  constructor(){
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