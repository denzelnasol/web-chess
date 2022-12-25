// Enums
import { PieceType } from "enums/PieceType";

// Rules
import { isValidPawnPosition } from "referee/Rules/PawnRules";
import { isValidKnightPosition } from "referee/Rules/KnightRules";
import { isValidBishopPosition } from "referee/Rules/BishopRules";
import { isValidRookPosition } from "referee/Rules/RookRules";

export default class Referee {

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
    }
    return isValidPosition;
  }
}
