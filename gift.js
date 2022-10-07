// create class for gifts
class Gift {
  static all = [];

  constructor(name) {
    this.name = name;
    this.assignedTo = null;

    Gift.all.push(this);
  }

  assignTo(child) {
    this.assignedTo = child;
  }
}

export default Gift;

