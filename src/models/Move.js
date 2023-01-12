export default class Move {
  constructor(piece, toPosition, capturedPiece) {
    this.piece = piece;
    this.toPosition = toPosition;
    this.capturedPiece = capturedPiece;
  }
}
