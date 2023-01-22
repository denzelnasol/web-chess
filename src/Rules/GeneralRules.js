// Utilities
import { samePosition } from "utilities/Position";
import { cloneBoardState } from "utilities/Board";

// Enums
import { PieceType } from "enums/PieceType";

// Rules
import { getPossiblePawnAttackMoves } from "Rules/PieceRules/PawnRules";
import { getPossibleRookAttackMoves, getStandardRookMoves } from "Rules/PieceRules/RookRules";
import { getPossibleBishopAttackMoves, getStandardBishopMoves } from "Rules/PieceRules/BishopRules";
import { getPossibleQueenAttackMoves, getStandardQueenMoves } from "Rules/PieceRules/QueenRules";
import { getPossibleKnightAttackMoves, getStandardKnightMoves } from "Rules/PieceRules/KnightRules";
import { getPiecesAttackingKing } from "Rules/PieceRules/KingRules";

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

export function tileIsOccupiedByAlly(newPosition, boardState, teamType) {
  const piece = boardState.find((p) => samePosition(p.position, newPosition) && p.teamType === teamType);
  return piece;
}

export function tileIsOccupiedByOpponentKing(newPosition, boardState, teamType) {
  const piece = boardState.find((p) => samePosition(p.position, newPosition) && p.teamType !== teamType && p.type === PieceType.KING);
  return piece;
}

export function getOpponentAttackMoves(teamType, boardState) {
  const opponentAttackMoves = [];

  boardState.forEach((piece) => {
    if (piece.teamType !== teamType) {
      const attackMoves = getPieceAttackMoves(piece, boardState);
      attackMoves.forEach((attackMove) => opponentAttackMoves.push(attackMove));
    }
  });

  return opponentAttackMoves;
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
    case PieceType.KNIGHT:
      attackMoves = getPossibleKnightAttackMoves(piece, boardState);
      break;
    default:
      attackMoves = piece.possibleMoves;
  }

  return attackMoves;
}

export function getPieceFromPosition(position, boardState) {
  const piece = boardState.find((piece) =>
    samePosition(piece.position, position)
  );
  return piece;
}

export function addPieceToBoard(piece, boardState) {
  const tempBoardState = boardState.push(piece);
  return tempBoardState;
}

export const getStandardPieceMoves = (piece, boardState) => {
  let standardMoves = [];
  switch (piece.type) {
    case PieceType.ROOK:
      standardMoves = getStandardRookMoves(piece, boardState);
      break;
    case PieceType.BISHOP:
      standardMoves = getStandardBishopMoves(piece, boardState);
      break;
    case PieceType.QUEEN:
      standardMoves = getStandardQueenMoves(piece, boardState);
      break;
    case PieceType.KNIGHT:
      standardMoves = getStandardKnightMoves(piece, boardState);
  }
  return standardMoves;
};
