// Enums
import { PieceType } from 'enums/PieceType';

// Models
import Piece from 'models/Pieces/Piece';

export default class Rook extends Piece {
  constructor(position, teamType, castleAvailable = false, possibleMoves = [], isImmovable = false) {
    super(position, PieceType.ROOK, teamType, possibleMoves, isImmovable);
    this.castleAvailable = castleAvailable;
    this.isImmovable = isImmovable
  }

  clone() {
    return new Rook(this.position.clone(), this.teamType, this.castleAvailable, this.possibleMoves?.map(move => move.clone()), this.isImmovable);
  }
}
