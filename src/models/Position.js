export default class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Position(this.x, this.y);
}
}