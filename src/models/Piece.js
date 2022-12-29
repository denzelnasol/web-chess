export default class Piece {
  constructor(position, type, teamType, possibleMoves = []) {
    this.image = `images/${teamType}-${type}.png`;
    this.position = position;
    this.type = type;
    this.teamType = teamType;
    this.enPassant = false;
    this.possibleMoves = possibleMoves;
  }

  clone() {
    return new Piece(this.position.clone(), this.type, this.teamType, this.possibleMoves?.map((move) => move.clone()));
  }
}