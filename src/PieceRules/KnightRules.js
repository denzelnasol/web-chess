// Utilities
import { getPositionPointDifference } from "utilities/Position";

// Rules
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupiedByAlly, getPinnedPieceMoves, getPieceFromPosition, checkIfPiecePinned, validPinnedPieceMove } from "PieceRules/GeneralRules";
import { kingIsChecked, getKingCheckPieceMoves, validKingCheckMove } from "PieceRules/KingRules";

// Models
import Position from "models/Position";

export function isValidKnightPosition(grabPosition, newPosition, teamType, boardState) {

  const knight = getPieceFromPosition(grabPosition, boardState);
  const possibleKnightMoves = getPossibleKnightMoves(knight, boardState);

  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(teamType, boardState);
  if (isKingCheck) {
    const isKingThreatenedKnightMoveValid = validKingCheckMove(teamType, boardState, newPosition, possibleKnightMoves);
    return isKingThreatenedKnightMoveValid;
  }

  // ** ROOK PINNED LOGIC ** //
  const isRookPinned = checkIfPiecePinned(knight, boardState);
  if (isRookPinned) {
    const isPinnedRookMoveValid = validPinnedPieceMove(knight, boardState, newPosition);
    return isPinnedRookMoveValid;
  }

  // ** STANDARD MOVE LOGIC ** //
  const isStandardKnightMoveValid = validStandardKnightMove(knight.teamType, boardState, newPosition, grabPosition);
  return isStandardKnightMoveValid;
}

export function getPossibleKnightMoves(knight, boardState) {
  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(knight.teamType, boardState);
  if (isKingCheck) {
    const kingThreatenedRookMoves = getKingCheckPieceMoves(knight, boardState);
    return kingThreatenedRookMoves;
  }

  // ** KNIGHT PINNED LOGIC ** //
  const isKnightPinned = checkIfPiecePinned(knight, boardState);
  if (isKnightPinned) {
    const pinnedKnightMoves = getPinnedPieceMoves(knight, boardState);
    return pinnedKnightMoves;
  }

  // ** STANDARD MOVE LOGIC ** //
  const standardKnightMoves = getStandardKnightMoves(knight, boardState);
  return standardKnightMoves;
}

export const getPossibleKnightAttackMoves = (knight, boardState) => {
  const possibleMoves = [];

  const knightMoves = [ [1, 2], [1, -2], [2, 1], [2, -1], [-2, -1], [-1, -2], [-1, 2], [-2, 1]];

  knightMoves.forEach((move) => {
    const newPos = new Position(knight.position.x + move[0], knight.position.y + move[1]);
    if (newPos.outOfBounds()) return;
    if (tileIsEmptyOrOccupiedByOpponent(newPos, boardState, knight.teamType)  || tileIsOccupiedByAlly(newPos, boardState, knight.teamType)) possibleMoves.push(newPos);
  })
  return possibleMoves;
};

// *********************** STANDARD KNIGHT MOVE FUNCTIONS *********************** //
export const getStandardKnightMoves = (knight, boardState) => {
  const possibleMoves = [];
  const knightMoves = [ [1, 2], [1, -2], [2, 1], [2, -1], [-2, -1], [-1, -2], [-1, 2], [-2, 1]];

  knightMoves.forEach((move) => {
    const newPos = new Position(knight.position.x + move[0], knight.position.y + move[1]);
    if (newPos.outOfBounds()) return;
    if (tileIsEmptyOrOccupiedByOpponent(newPos, boardState, knight.teamType)) possibleMoves.push(newPos);
  })
  return possibleMoves;
};

const validStandardKnightMove = (teamType, boardState, newPosition, grabPosition) => {
  const xDifference = Math.abs(getPositionPointDifference(newPosition.x, grabPosition.x));
  const yDifference = Math.abs(getPositionPointDifference(newPosition.y, grabPosition.y));

  // ** MOVEMENT/ATTACK LOGIC ** //
  if ((xDifference === 2 && yDifference === 1) || (xDifference === 1 && yDifference === 2)) {
    if (tileIsEmptyOrOccupiedByOpponent(newPosition, boardState, teamType)) {
      return true;
    }
  }

  return false;
};