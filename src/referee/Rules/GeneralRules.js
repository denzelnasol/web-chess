// Utilities
import { samePosition } from "utilities/Position";
import { cloneBoardState } from "utilities/Board";

// Enums
import { PieceType } from "enums/PieceType";

// Rules
import { getPossiblePawnAttackMoves } from "referee/Rules/PawnRules";
import { getPossibleRookAttackMoves } from "referee/Rules/RookRules";
import { getPossibleBishopAttackMoves } from "referee/Rules/BishopRules";
import { getPossibleQueenAttackMoves } from "referee/Rules/QueenRules";
import { getPossibleKnightAttackMoves } from "referee/Rules/KnightRules";
import { getPiecesAttackingKing } from "referee/Rules/KingRules";

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
  const tempBoardState = boardState.filter((currentPiece) => 
    !samePosition(currentPiece.position, piece.position)
  );

  const piecesAttackingKing = getPiecesAttackingKing(piece.teamType, tempBoardState);
  if (piecesAttackingKing.length > 0) return true;

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
