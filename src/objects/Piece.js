export default class Piece {
  constructor(image, position, type, teamType) {
    this.image = image;
    this.position = position;
    this.type = type;
    this.teamType = teamType;
    this.enPassant = false;
  }
}