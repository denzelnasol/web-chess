export default class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Position(this.x, this.y);
  }

  outOfBounds() {
    return this.x < 0 || this.x > 7 || this.y < 0 || this.y > 7;
  }
}
