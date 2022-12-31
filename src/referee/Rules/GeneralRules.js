// Utilities
import { samePosition } from "utilities/Position";

// Enums
import { PieceType } from "enums/PieceType";

// Rules
import { getPossiblePawnAttackMoves } from "referee/Rules/PawnRules";
import { getPossibleRookAttackMoves } from "referee/Rules/RookRules";
import { getPossibleBishopAttackMoves } from "referee/Rules/BishopRules";
import { getPossibleQueenAttackMoves } from "referee/Rules/QueenRules";

export function tileIsEmptyOrOccupiedByOpponent(newPosition, boardState, teamType) {
  return !tileIsOccupied(newPosition, boardState) || tileIsOccupiedByOpponent(newPosition, boardState, teamType);
}

export function tileIsOccupied(newPosition, boardState) {
  const piece = boardState.find((p) => samePosition(p.position, newPosition));
  return piece;
}

export function tileIsOccupiedByOpponent(newPosition, boardState, teamType) {
  const piece = boardState.find((p) => samePosition(p.position, newPosition) && p.teamType !== teamType);
  return piece;
}

export function tileIsOccupiedByOpponentKing(newPosition, boardState, teamType) {
  const piece = boardState.find((p) => samePosition(p.position, newPosition) && p.teamType !== teamType && p.type === PieceType.KING);
  return piece;
}

export function getOpponentAttackMoves(teamType, boardState) {
  const possibleAttackMoves = [];
  for (const piece of boardState) {
    if (piece.teamType !== teamType) {
      let attackMoves = [];
      switch (piece.type) {
        case PieceType.PAWN:
          attackMoves = getPossiblePawnAttackMoves(piece);
          break;
        case PieceType.ROOK:
          attackMoves = getPossibleRookAttackMoves(piece, boardState);
          break;
        case PieceType.BISHOP:
          attackMoves = getPossibleBishopAttackMoves(piece, boardState);
          break;
        case PieceType.QUEEN:
          attackMoves = getPossibleQueenAttackMoves(piece, boardState);
          break;
        default:
          attackMoves = piece.possibleMoves;
      }

      for (const move of attackMoves) possibleAttackMoves.push(move);
    }
  }

  return possibleAttackMoves;
}

export function getPieceAttackMoves(piece, boardState) {
  let attackMoves = [];
  switch (piece.type) {
    case PieceType.PAWN:
      attackMoves = getPossiblePawnAttackMoves(piece);
      break;
    case PieceType.ROOK:
      attackMoves = getPossibleRookAttackMoves(piece, boardState);
      break;
    case PieceType.BISHOP:
      attackMoves = getPossibleBishopAttackMoves(piece, boardState);
      break;
    case PieceType.QUEEN:
      attackMoves = getPossibleQueenAttackMoves(piece, boardState);
      break;
    default:
      attackMoves = piece.possibleMoves;
  }

  return attackMoves;
}