// Utilities
import { samePosition } from "utilities/Position";

// Rules
import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent, tileIsOccupiedByOpponent, tileIsOccupiedByOpponentKing, tileIsOccupiedByAlly, getPieceFromPosition, checkIfPiecePinned, getPinnedPieceMoves, validPinnedPieceMove } from "PieceRules/GeneralRules";
import { kingIsChecked, validKingCheckMove, getKingCheckPieceMoves } from "PieceRules/KingRules";

// Enums
import { Operator, operatorOperations } from "enums/Operator";

// Objects
import Position from "models/Position";

export const isValidBishopPosition = (grabPosition, newPosition, teamType, boardState) => {
  const bishop = getPieceFromPosition(grabPosition, boardState);
  const possibleBishopMoves = getPossibleBishopMoves(bishop, boardState);

  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(teamType, boardState);
  if (isKingCheck) {
    const isKingThreatenedBishopMoveValid = validKingCheckMove(teamType, boardState, newPosition, possibleBishopMoves);
    return isKingThreatenedBishopMoveValid;
  }

  // ** BISHOP PINNED LOGIC ** //
  const isBishopPinned = checkIfPiecePinned(bishop, boardState);
  if (isBishopPinned) {
    const isPinnedBishopMoveValid = validPinnedPieceMove(bishop, boardState, newPosition);
    return isPinnedBishopMoveValid;
  }

  // ** STANDARD MOVE LOGIC ** //
  const isStandardBishopMoveValid = validStandardBishopMove(bishop.teamType, boardState, newPosition, grabPosition);
  return isStandardBishopMoveValid;
};

export const getPossibleBishopMoves = (bishop, boardState) => {

  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(bishop.teamType, boardState);
  if (isKingCheck) {
    const kingThreatenedBishopMoves = getKingCheckPieceMoves(bishop, boardState);
    return kingThreatenedBishopMoves;
  }

  // ** BISHOP PINNED LOGIC ** //
  const isBishopPinned = checkIfPiecePinned(bishop, boardState);
  if (isBishopPinned) {
    const pinnedBishopMoves = getPinnedPieceMoves(bishop, boardState);
    return pinnedBishopMoves;
  }

  // ** STANDARD MOVE LOGIC ** //
  const standardBishopMoves = getStandardBishopMoves(bishop, boardState);
  return standardBishopMoves;
};

// *********************** BISHOP ATTACK FUNCTIONS *********************** //
export const getPossibleBishopAttackMoves = (bishop, boardState) => {
  const possibleMoves = [];

  const upperRightMoves = getBishopDiagonalAttackMoves(bishop, boardState, Operator.ADDITION, Operator.ADDITION);
  possibleMoves.push(...upperRightMoves);

  const bottomRightMoves = getBishopDiagonalAttackMoves(bishop, boardState, Operator.ADDITION, Operator.SUBTRACTION);
  possibleMoves.push(...bottomRightMoves);

  const upperLeftMoves = getBishopDiagonalAttackMoves(bishop, boardState, Operator.SUBTRACTION, Operator.SUBTRACTION);
  possibleMoves.push(...upperLeftMoves);

  const bottomLeftMoves = getBishopDiagonalAttackMoves(bishop, boardState, Operator.SUBTRACTION, Operator.ADDITION);
  possibleMoves.push(...bottomLeftMoves);

  return possibleMoves;
};

const getBishopDiagonalAttackMoves = (bishop, boardState, xOperator, yOperator) => {
  const possibleMoves = [];
  for (let i = 1; i < 8; i++) {
    const positionX = operatorOperations[xOperator](bishop.position.x, i);
    const positionY = operatorOperations[yOperator](bishop.position.y, i);
    const passedPosition = new Position(positionX, positionY);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState) || tileIsOccupiedByOpponentKing(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, bishop.teamType) || tileIsOccupiedByAlly(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};

// *********************** STANDARD BISHOP MOVE FUNCTIONS *********************** //
export const getStandardBishopMoves = (bishop, boardState) => {
  const possibleMoves = [];

  const upperRightMoves = getPossibleBishopDiagonalMoves(bishop, boardState, Operator.ADDITION, Operator.ADDITION);
  possibleMoves.push(...upperRightMoves);

  const bottomRightMoves = getPossibleBishopDiagonalMoves(bishop, boardState, Operator.ADDITION, Operator.SUBTRACTION);
  possibleMoves.push(...bottomRightMoves);

  const upperLeftMoves = getPossibleBishopDiagonalMoves(bishop, boardState, Operator.SUBTRACTION, Operator.SUBTRACTION);
  possibleMoves.push(...upperLeftMoves);

  const bottomLeftMoves = getPossibleBishopDiagonalMoves(bishop, boardState, Operator.SUBTRACTION, Operator.ADDITION);
  possibleMoves.push(...bottomLeftMoves);

  return possibleMoves
};

const getPossibleBishopDiagonalMoves = (bishop, boardState, xOperator, yOperator) => {
  const possibleMoves = [];
  for (let i = 1; i < 8; i++) {
    const positionX = operatorOperations[xOperator](bishop.position.x, i);
    const positionY = operatorOperations[yOperator](bishop.position.y, i);
    const passedPosition = new Position(positionX, positionY);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};

const validStandardBishopMove = (teamType, boardState, newPosition, grabPosition) => {
  // ** MOVEMENT/ATTACK LOGIC ** //
  for (let i = 1; i < 8; i++) {
    if (newPosition.x > grabPosition.x && newPosition.y > grabPosition.y) {
      const passedPosition = new Position(grabPosition.x + i, grabPosition.y + i);
      if (lastBishopTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (newPosition.x > grabPosition.x && newPosition.y < grabPosition.y) {
      const passedPosition = new Position(grabPosition.x + i, grabPosition.y - i);
      if (lastBishopTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (newPosition.x < grabPosition.x && newPosition.y < grabPosition.y) {
      const passedPosition = new Position(grabPosition.x - i, grabPosition.y - i);
      if (lastBishopTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (newPosition.x < grabPosition.x && newPosition.y > grabPosition.y) {
      const passedPosition = new Position(grabPosition.x - i, grabPosition.y + i);
      if (lastBishopTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    }
  }

  return false;
}

const lastBishopTileIsValid = (newPosition, passedPosition, boardState, teamType) => {
  if (samePosition(newPosition, passedPosition)) {
    if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, teamType)) {
      return true;
    }
  }

  return false;
};