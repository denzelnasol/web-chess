// Enums
import { PieceType } from 'enums/PieceType';

// Models
import Piece from 'models/Pieces/Piece';

export default class King extends Piece {
  constructor(position, teamType, castleAvailable = false, inCheck = false, possibleMoves = [], isImmovable = false) {
    super(position, PieceType.KING, teamType, possibleMoves, isImmovable);
    this.castleAvailable = castleAvailable;
    this.inCheck = inCheck;
    this.isImmovable = isImmovable
    this.possibleMoves = possibleMoves;
  }

  clone() {
    return new King(this.position.clone(), this.teamType, this.castleAvailable, this.inCheck, this.possibleMoves?.map(move => move.clone()), this.isImmovable);
  }
}
