// Utilities
import { samePosition } from "utilities/Position";
import { cloneBoardState } from "utilities/Board";

// Rules
import { getStandardPieceMoves, tileIsEmptyOrOccupiedByOpponent } from "Rules/GeneralRules";
import { getPiecesAttackingKing } from "Rules/CheckRules";

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
