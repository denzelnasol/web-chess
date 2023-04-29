export default class Move {
  constructor(piece, fromPosition, toPosition, capturedPiece) {
    this.piece = piece;
    this.fromPosition = fromPosition;
    this.toPosition = toPosition;
    this.capturedPiece = capturedPiece;
  }
}
