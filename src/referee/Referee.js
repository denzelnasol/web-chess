// Enums
import { PieceType } from "enums/PieceType";

// Rules
import { getPossiblePawnMoves, isValidPawnPosition } from "referee/Rules/PawnRules";
import { getPossibleKnightMoves, isValidKnightPosition } from "referee/Rules/KnightRules";
import { getPossibleBishopMoves, isValidBishopPosition } from "referee/Rules/BishopRules";
import { getPossibleRookMoves, isValidRookPosition } from "referee/Rules/RookRules";
import { getPossibleQueenMoves, isValidQueenPosition } from "referee/Rules/QueenRules";
import { getPossibleKingMoves, isValidKingPosition } from "referee/Rules/KingRules";

export default class Referee {

  /** @TODO
   * Prevent king from moving into danger
   * Castling
   * Add checkmate
   * Add checks
   * Add stalemate
   */
  isValidMove(grabPosition, newPosition, type, teamType, boardState) {
    let isValidPosition = false;
    switch (type) {
      case PieceType.PAWN:
        isValidPosition = isValidPawnPosition(grabPosition, newPosition, teamType, boardState);
        break;
      case PieceType.KNIGHT:
        isValidPosition = isValidKnightPosition(grabPosition, newPosition, teamType, boardState);
        break;
      case PieceType.BISHOP:
        isValidPosition = isValidBishopPosition(grabPosition, newPosition, teamType, boardState);
        break;
      case PieceType.ROOK:
        isValidPosition = isValidRookPosition(grabPosition, newPosition, teamType, boardState);
        break;
      case PieceType.QUEEN:
        isValidPosition = isValidQueenPosition(grabPosition, newPosition, teamType, boardState);
        break;
      case PieceType.KING:
        isValidPosition = isValidKingPosition(grabPosition, newPosition, teamType, boardState);
    }
    return isValidPosition;
  }

  getPossibleMoves(piece, boardState) {
    let possibleMoves = [];

    switch (piece.type) {
      case PieceType.PAWN:
        possibleMoves = getPossiblePawnMoves(piece, boardState);
        break;
      case PieceType.KNIGHT:
        possibleMoves = getPossibleKnightMoves(piece, boardState);
        break;
      case PieceType.BISHOP:
        possibleMoves = getPossibleBishopMoves(piece, boardState);
        break;
      case PieceType.ROOK:
        possibleMoves = getPossibleRookMoves(piece, boardState);
        break;
      case PieceType.QUEEN:
        possibleMoves = getPossibleQueenMoves(piece, boardState);
        break;
      case PieceType.KING:
        possibleMoves = getPossibleKingMoves(piece, boardState);
    }

    return possibleMoves;
  }
}
