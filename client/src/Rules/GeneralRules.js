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
import { getStandardKingMoves } from "Rules/PieceRules/KingRules";

// *********************** PRIVATE FUNCTIONS *********************** //
const moveIsAnAttack = (move, boardState, teamType) => {
  const pieceAtPosition = boardState[move.row][move.col];
  return pieceAtPosition && pieceAtPosition.teamType !== teamType;
}

// *********************** GENERAL RULE FUNCTIONS *********************** //
const tileIsEmptyOrOccupiedByOpponent = (newPosition, boardState, teamType) => {
  return !tileIsOccupied(newPosition, boardState) || tileIsOccupiedByOpponent(newPosition, boardState, teamType);
}

const tileIsOccupied = (newPosition, boardState) => {
  return boardState.some((p) => samePosition(p.position, newPosition));
}

const tileIsOccupiedByOpponent = (newPosition, boardState, teamType) => {
  return boardState.some((p) => samePosition(p.position, newPosition) && p.teamType !== teamType);
}

const tileIsOccupiedByAlly = (newPosition, boardState, teamType) => {
  return boardState.some((p) => samePosition(p.position, newPosition) && p.teamType === teamType);
}

const tileIsOccupiedByOpponentKing = (newPosition, boardState, teamType) => {
  return boardState.some((p) => samePosition(p.position, newPosition) && p.teamType !== teamType && p.type === PieceType.KING);
}

const getOpponentAttackMoves = (teamType, boardState) => {
  const opponentAttackMoves = [];

  boardState.forEach((piece) => {
    if (piece.teamType !== teamType) {
      opponentAttackMoves.push(...getPieceAttackMoves(piece, boardState));
    }
  });

  return opponentAttackMoves;
}

function getPieceAttackMoves(piece, boardState) {
  switch (piece.type) {
    case PieceType.PAWN:
      return getPossiblePawnAttackMoves(piece);
    case PieceType.ROOK:
      return getPossibleRookAttackMoves(piece, boardState);
    case PieceType.BISHOP:
      return getPossibleBishopAttackMoves(piece, boardState);
    case PieceType.QUEEN:
      return getPossibleQueenAttackMoves(piece, boardState);
    case PieceType.KNIGHT:
      return getPossibleKnightAttackMoves(piece, boardState);
    case PieceType.KING:
      return getStandardKingMoves(piece, boardState, true);
    default:
      return piece.possibleMoves;
  }
}

const getPieceFromPosition = (position, boardState) => {
  return boardState.find((piece) =>
    samePosition(piece.position, position)
  );
}

const addPieceToBoard = (piece, boardState) => {
  return boardState.concat(piece);
}

const getStandardPieceMoves = (piece, boardState) => {
  switch (piece.type) {
    case PieceType.ROOK:
      return getStandardRookMoves(piece, boardState);
    case PieceType.BISHOP:
      return getStandardBishopMoves(piece, boardState);
    case PieceType.QUEEN:
      return getStandardQueenMoves(piece, boardState);
    case PieceType.KNIGHT:
      return getStandardKnightMoves(piece, boardState);
    default:
      return [];
  }
};

export {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
  tileIsOccupiedByAlly,
  tileIsOccupiedByOpponentKing,
  getOpponentAttackMoves,
  getPieceAttackMoves,
  getPieceFromPosition,
  addPieceToBoard,
  getStandardPieceMoves
};