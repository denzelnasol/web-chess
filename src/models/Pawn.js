// Enums
import { PieceType } from 'enums/PieceType';

// Models
import Piece from 'models/Piece';

export default class Pawn extends Piece {
  constructor(position, teamType, enPassant, possibleMoves = [], isImmovable = false) {
    super(position, PieceType.PAWN, teamType, possibleMoves);
    this.enPassant = enPassant;
    this.isImmovable = isImmovable;
  }

  clone() {
    return new Pawn(this.position.clone(), this.teamType, this.enPassant, this.possibleMoves?.map(move => move.clone()), this.isImmovable);
  }
}
