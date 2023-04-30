// Utilities
import { samePosition } from "utilities/Position";
import { cloneBoardState } from "utilities/Board";

// Rules
import { getStandardPieceMoves, tileIsEmptyOrOccupiedByOpponent } from "Rules/GeneralRules";
import { getPiecesAttackingKing } from "Rules/CheckRules";

const checkIfPiecePinned = (piece, boardState) => {
  const currentAttackingPieces = getPiecesAttackingKing(piece.teamType, boardState);
  const tempBoardState = boardState.filter((p) => !samePosition(p.position, piece.position));
  const attackingPieces = getPiecesAttackingKing(piece.teamType, tempBoardState);
  return attackingPieces.length > 0 && attackingPieces.length > currentAttackingPieces.length;
}

const checkPinnedPiecePotentialMove = (move, piece, boardState) => {
  let tempBoardState = cloneBoardState(boardState);
  tempBoardState = tempBoardState.filter((p) => !samePosition(p.position, piece.position));
  tempBoardState = tempBoardState.filter((p) => !samePosition(move, p.position) || (piece.type === p.type && piece.teamType === p.teamType));
  const attackingPieces = getPiecesAttackingKing(piece.teamType, tempBoardState);
  return attackingPieces.length === 0 || attackingPieces === null ? move : undefined;
}

const getPinnedPieceMoves = (piece, boardState) => {
  return getStandardPieceMoves(piece, boardState).filter((move) => checkPinnedPiecePotentialMove(move, piece, boardState));
}

const validPinnedPieceMove = (piece, boardState, newPosition) => {
  return getStandardPieceMoves(piece, boardState).some((move) => {
    return tileIsEmptyOrOccupiedByOpponent(move, boardState, piece.teamType) && samePosition(move, newPosition) && checkPinnedPiecePotentialMove(move, piece, boardState);
  });
}

export {
  checkIfPiecePinned,
  checkPinnedPiecePotentialMove,
  getPinnedPieceMoves,
  validPinnedPieceMove
};