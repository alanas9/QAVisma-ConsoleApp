// create class for gifts
class Child {
  static all = [];

  constructor(name) {
    this.name = name;
    this.assignedGift = null;

    Child.all.push(this);
  }

  assignGift(gift) {
    this.assignedGift = gift;
  }
}

export default Child;
