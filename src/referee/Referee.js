// Enums
import { PieceType } from "enums/PieceType";

// Rules
import { isValidPawnPosition } from "referee/Rules/PawnRules";
import { isValidKnightPosition } from "referee/Rules/KnightRules";
import { isValidBishopPosition } from "referee/Rules/BishopRules";
import { isValidRookPosition } from "referee/Rules/RookRules";
import { isValidQueenPosition } from "referee/Rules/QueenRules";
import { isValidKingPosition } from "referee/Rules/KingRules";

export default class Referee {

  /** @TODO
   * Prevent king from moving into danger
   * Castling
   * Pawn promotion
   * Add checkmate
   * Add checks
   * Add stalemate
   */
  isValidMove(grabPosition, newPosition, type, teamType, boardState) {
    let isValidPosition = false;
    if (type === PieceType.PAWN) {
      isValidPosition = isValidPawnPosition(grabPosition, newPosition, teamType, boardState);
    } else if (type === PieceType.KNIGHT) {
      isValidPosition = isValidKnightPosition(grabPosition, newPosition, teamType, boardState);
    } else if (type === PieceType.BISHOP) {
      isValidPosition = isValidBishopPosition(grabPosition, newPosition, teamType, boardState);
    } else if (type === PieceType.ROOK) {
      isValidPosition = isValidRookPosition(grabPosition, newPosition, teamType, boardState);
    } else if (type === PieceType.QUEEN) {
      isValidPosition = isValidQueenPosition(grabPosition, newPosition, teamType, boardState);
    } else if (type === PieceType.KING) {
      isValidPosition = isValidKingPosition(grabPosition, newPosition, teamType, boardState);
    }
    return isValidPosition;
  }
}
