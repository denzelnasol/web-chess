export default class Piece {
  constructor(position, type, teamType, possibleMoves = [], castleAvailable = false, inCheck = false, isImmovable = false) {
    this.image = `images/${teamType}-${type.toLowerCase()}.png`;
    this.position = position;
    this.type = type;
    this.teamType = teamType;
    this.enPassant = false;
    this.possibleMoves = possibleMoves;
    this.castleAvailable = castleAvailable;
    this.inCheck = inCheck;
    this.isImmovable = isImmovable
  }

  clone() {
    return new Piece(this.position.clone(), this.type, this.teamType, this.possibleMoves?.map((move) => move.clone()), this.castleAvailable, this.inCheck, this.isImmovable);
  }

  abovePiece(otherPiece) {
    return this.position.y > otherPiece.position.y;
  }

  belowPiece(otherPiece) {
    return this.position.y < otherPiece.position.y;
  }

  rightOfPiece(otherPiece) {
    return this.position.x > otherPiece.position.x;
  }

  leftOfPiece(otherPiece) {
    return this.position.x < otherPiece.position.x;
  }
}
