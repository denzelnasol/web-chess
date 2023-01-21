// Utilities
import { samePosition } from "utilities/Position";
import { cloneBoardState } from "utilities/Board";

// Enums
import { PieceType } from "enums/PieceType";

// Rules
import { getPossiblePawnAttackMoves } from "PieceRules/PawnRules";
import { getPossibleRookAttackMoves, getStandardRookMoves } from "PieceRules/RookRules";
import { getPossibleBishopAttackMoves, getStandardBishopMoves } from "PieceRules/BishopRules";
import { getPossibleQueenAttackMoves, getStandardQueenMoves } from "PieceRules/QueenRules";
import { getPossibleKnightAttackMoves, getStandardKnightMoves } from "PieceRules/KnightRules";
import { getPiecesAttackingKing } from "PieceRules/KingRules";

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
        case PieceType.KNIGHT:
          attackMoves = getPossibleKnightAttackMoves(piece, boardState);
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

export const checkIfPiecePinned = (piece, boardState) => {
  const currentBoardStatePiecesAttackingKing = getPiecesAttackingKing(piece.teamType, boardState);
  const tempBoardState = boardState.filter((currentPiece) => 
    !samePosition(currentPiece.position, piece.position)
  );

  const piecesAttackingKing = getPiecesAttackingKing(piece.teamType, tempBoardState);
  if (piecesAttackingKing.length > 0 && piecesAttackingKing.length > currentBoardStatePiecesAttackingKing.length) return true;

  return false;
};

export const checkPinnedPiecePotentialMove = (move, piece, boardState) => {
  let tempBoardState = cloneBoardState(boardState);
  tempBoardState = tempBoardState.reduce((results, currentPiece) => {
    if (samePosition(currentPiece.position, piece.position)) currentPiece.position = move;
    results.push(currentPiece);
    return results;
  }, []);

  // Remove piece from temp boardState if attacked
  tempBoardState = tempBoardState.filter((currentPiece) => {
    if (samePosition(move, currentPiece.position) && piece.type !== currentPiece.type && piece.teamType !== currentPiece.teamType) {
      return false;
    }
    return true;
  });

  const piecesAttackingKing = getPiecesAttackingKing(piece.teamType, tempBoardState);
  if (piecesAttackingKing.length === 0 || !piecesAttackingKing) return move;
};

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

export const getPinnedPieceMoves = (piece, boardState) => {
  const possibleMoves = [];
  const standardPieceMoves = getStandardPieceMoves(piece, boardState);
  standardPieceMoves.forEach((pieceMove) => {
    const isMovePossible = checkPinnedPiecePotentialMove(pieceMove, piece, boardState);
    if (isMovePossible) possibleMoves.push(pieceMove);
  });

  return possibleMoves;
};

export const validPinnedPieceMove = (piece, boardState, newPosition) => {
  let isMoveValid = false;
  const standardPieceMoves = getStandardPieceMoves(piece, boardState);
  standardPieceMoves.forEach((pieceMove) => {
    if (tileIsEmptyOrOccupiedByOpponent(pieceMove, boardState, piece.teamType) && samePosition(pieceMove, newPosition)) {
      const isMovePossible = checkPinnedPiecePotentialMove(pieceMove, piece, boardState);
      if (isMovePossible) isMoveValid = true;
    }
  });

  return isMoveValid;
};
