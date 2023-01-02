// Enums
import { PieceType } from 'enums/PieceType';

// Models
import Piece from 'models/Piece';

export default class Pawn extends Piece {
  constructor(position, teamType, enPassant, possibleMoves = []) {
    super(position, PieceType.PAWN, teamType, possibleMoves);
    this.enPassant = enPassant;
  }

  clone() {
    return new Pawn(this.position.clone(), this.teamType, this.enPassant, this.possibleMoves?.map(move => move.clone()));
  }
}
