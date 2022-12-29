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

}
