// Utilities
import { sameColumn, samePosition, sameRow } from "utilities/Position";

// Rules
import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent, tileIsOccupiedByOpponent, tileIsOccupiedByOpponentKing, tileIsOccupiedByAlly, getPieceFromPosition, checkIfPiecePinned, checkPinnedPiecePotentialMove, getPinnedPieceMoves, validPinnedPieceMove } from "referee/Rules/GeneralRules";
import { kingIsChecked, validKingCheckMove, getKingCheckPieceMoves } from "referee/Rules/KingRules";

// Objects
import Position from "models/Position";

// Enums
import { Operator, operatorOperations } from "enums/Operator";

export function isValidRookPosition(grabPosition, newPosition, teamType, boardState) {
  const rook = getPieceFromPosition(grabPosition, boardState);
  const possibleRookMoves = getPossibleRookMoves(rook, boardState);

  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(teamType, boardState);
  if (isKingCheck) {
    const isKingThreatenedRookMoveValid = validKingCheckMove(teamType, boardState, newPosition, possibleRookMoves);
    return isKingThreatenedRookMoveValid;
  }

  // // ** ROOK PINNED LOGIC ** //
  const isRookPinned = checkIfPiecePinned(rook, boardState);
  if (isRookPinned) {
    const isPinnedRookMoveValid = validPinnedPieceMove(rook, boardState, newPosition);
    return isPinnedRookMoveValid;
  }

  // ** STANDARD MOVE LOGIC ** //
  const isStandardRookMoveValid = validStandardRookMove(rook.teamType, boardState, newPosition, grabPosition);
  return isStandardRookMoveValid;
}

export function getPossibleRookMoves(rook, boardState) {
  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(rook.teamType, boardState);
  if (isKingCheck) {
    const kingThreatenedRookMoves = getKingCheckPieceMoves(rook, boardState);
    return kingThreatenedRookMoves;
  }

  // ** ROOK PINNED LOGIC ** //
  const isRookPinned = checkIfPiecePinned(rook, boardState);
  if (isRookPinned) {
    const pinnedRookMoves = getPinnedPieceMoves(rook, boardState);
    return pinnedRookMoves;
  }

  // ** STANDARD MOVE LOGIC ** //
  const standardRookMoves = getStandardRookMoves(rook, boardState);
  return standardRookMoves;
}

export const getPossibleRookAttackMoves = (rook, boardState) => {
  const possibleMoves = [];

  const upMoves = getRookLineAttackMoves(rook, boardState, undefined, Operator.ADDITION);
  possibleMoves.push(...upMoves);

  const bottomMoves = getRookLineAttackMoves(rook, boardState, undefined, Operator.SUBTRACTION);
  possibleMoves.push(...bottomMoves);

  const leftMoves = getRookLineAttackMoves(rook, boardState, Operator.SUBTRACTION, undefined);
  possibleMoves.push(...leftMoves);

  const rightMoves = getRookLineAttackMoves(rook, boardState, Operator.ADDITION, undefined);
  possibleMoves.push(...rightMoves);

  return possibleMoves;
}

const getRookLineAttackMoves = (rook, boardState, xOperator, yOperator) => {
  const possibleMoves = [];
  for (let i = 1; i < 8; i++) {
    const positionX = xOperator ? operatorOperations[xOperator](rook.position.x, i) : rook.position.x;
    const positionY = yOperator ? operatorOperations[yOperator](rook.position.y, i) : rook.position.y;
    const passedPosition = new Position(positionX, positionY);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState) || tileIsOccupiedByOpponentKing(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, rook.teamType) || tileIsOccupiedByAlly(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};

// *********************** STANDARD ROOK MOVE FUNCTIONS *********************** //
export const getStandardRookMoves = (rook, boardState) => {
  const possibleMoves = [];

  const upMoves = getPossibleRookLineMoves(rook, boardState, undefined, Operator.ADDITION);
  possibleMoves.push(...upMoves);

  const bottomMoves = getPossibleRookLineMoves(rook, boardState, undefined, Operator.SUBTRACTION);
  possibleMoves.push(...bottomMoves);

  const leftMoves = getPossibleRookLineMoves(rook, boardState, Operator.SUBTRACTION, undefined);
  possibleMoves.push(...leftMoves);

  const rightMoves = getPossibleRookLineMoves(rook, boardState, Operator.ADDITION, undefined);
  possibleMoves.push(...rightMoves);

  return possibleMoves
};

const getPossibleRookLineMoves = (rook, boardState, xOperator, yOperator) => {
  const possibleMoves = [];
  for (let i = 1; i < 8; i++) {
    const positionX = xOperator ? operatorOperations[xOperator](rook.position.x, i) : rook.position.x;
    const positionY = yOperator ? operatorOperations[yOperator](rook.position.y, i) : rook.position.y;
    const passedPosition = new Position(positionX, positionY);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};

const validStandardRookMove = (teamType, boardState, newPosition, grabPosition) => {
  // ** MOVEMENT/ATTACK LOGIC ** //
  for (let i = 1; i < 8; i++) {
    if (newPosition.x > grabPosition.x && sameRow(newPosition, grabPosition)) {
      const passedPosition = new Position(grabPosition.x + i, grabPosition.y);
      if (lastRookTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (newPosition.x < grabPosition.x && sameRow(newPosition, grabPosition)) {
      const passedPosition = new Position(grabPosition.x - i, grabPosition.y);
      if (lastRookTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (sameColumn(newPosition, grabPosition) && newPosition.y > grabPosition.y) {
      const passedPosition = new Position(grabPosition.x, grabPosition.y + i);
      if (lastRookTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (sameColumn(newPosition, grabPosition) && newPosition.y < grabPosition.y) {
      const passedPosition = new Position(grabPosition.x, grabPosition.y - i);
      if (lastRookTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    }
  }
  return false;
};

const lastRookTileIsValid = (newPosition, passedPosition, boardState, teamType) => {
  if (samePosition(newPosition, passedPosition)) {
    if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, teamType)) {
      return true;
    }
  }

  return false;
};
