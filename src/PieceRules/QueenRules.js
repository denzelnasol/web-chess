// Utilities
import { samePosition } from "utilities/Position";

// Enums
import { Operator, operatorOperations } from "enums/Operator";

// Rules
import { getKingCheckPieceMoves, kingIsChecked, validKingCheckMove } from "PieceRules/KingRules";
import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent, tileIsOccupiedByOpponent, tileIsOccupiedByOpponentKing, tileIsOccupiedByAlly, getPieceFromPosition, getPinnedPieceMoves, checkIfPiecePinned, validPinnedPieceMove } from "PieceRules/GeneralRules";

// Objects
import Position from "models/Position";

export function isValidQueenPosition(grabPosition, newPosition, teamType, boardState) {
  const queen = getPieceFromPosition(grabPosition, boardState);
  const possibleQueenMoves = getPossibleQueenMoves(queen, boardState);

  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(teamType, boardState);
  if (isKingCheck) {
    const isKingThreatenedQueenMoveValid = validKingCheckMove(teamType, boardState, newPosition, possibleQueenMoves);
    return isKingThreatenedQueenMoveValid;
  }

  // ** QUEEN PINNED LOGIC ** //
  const isQueenPinned = checkIfPiecePinned(queen, boardState);
  if (isQueenPinned) {
    const isPinnedQueenMoveValid = validPinnedPieceMove(queen, boardState, newPosition);
    return isPinnedQueenMoveValid;
  }


  // ** STANDARD MOVE LOGIC ** //
  const isStandardQueenMoveValid = validStandardQueenMove(queen.teamType, boardState, newPosition, grabPosition);
  return isStandardQueenMoveValid;
}

export function getPossibleQueenMoves(queen, boardState) {

  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(queen.teamType, boardState);
  if (isKingCheck) {
    const kingThreatenedQueenMoves = getKingCheckPieceMoves(queen, boardState);
    return kingThreatenedQueenMoves;
  }

  // ** QUEEN PINNED LOGIC ** //
  const isQueenPinned = checkIfPiecePinned(queen, boardState);
  if (isQueenPinned) {
    const pinnedQueenMoves = getPinnedPieceMoves(queen, boardState);
    return pinnedQueenMoves;
  }

  // ** STANDARD MOVE LOGIC ** //
  const standardQueenMoves = getStandardQueenMoves(queen, boardState);
  return standardQueenMoves;

}

// *********************** QUEEN ATTACK FUNCTIONS *********************** //
export function getPossibleQueenAttackMoves(queen, boardState) {
  const possibleMoves = [];

  const upMoves = getQueenLineDiagonalAttackMoves(queen, boardState, undefined, Operator.ADDITION);
  possibleMoves.push(...upMoves);

  const bottomMoves = getQueenLineDiagonalAttackMoves(queen, boardState, undefined, Operator.SUBTRACTION);
  possibleMoves.push(...bottomMoves);

  const leftMoves = getQueenLineDiagonalAttackMoves(queen, boardState, Operator.SUBTRACTION, undefined);
  possibleMoves.push(...leftMoves);

  const rightMoves = getQueenLineDiagonalAttackMoves(queen, boardState, Operator.ADDITION, undefined);
  possibleMoves.push(...rightMoves);

  const upperRightMoves = getQueenLineDiagonalAttackMoves(queen, boardState, Operator.ADDITION, Operator.ADDITION);
  possibleMoves.push(...upperRightMoves);

  const bottomRightMoves = getQueenLineDiagonalAttackMoves(queen, boardState, Operator.ADDITION, Operator.SUBTRACTION);
  possibleMoves.push(...bottomRightMoves);

  const upperLeftMoves = getQueenLineDiagonalAttackMoves(queen, boardState, Operator.SUBTRACTION, Operator.SUBTRACTION);
  possibleMoves.push(...upperLeftMoves);

  const bottomLeftMoves = getQueenLineDiagonalAttackMoves(queen, boardState, Operator.SUBTRACTION, Operator.ADDITION);
  possibleMoves.push(...bottomLeftMoves);

  return possibleMoves
}

const getQueenLineDiagonalAttackMoves = (queen, boardState, xOperator, yOperator) => {
  const possibleMoves = [];
  for (let i = 1; i < 8; i++) {
    const positionX = xOperator ? operatorOperations[xOperator](queen.position.x, i) : queen.position.x;
    const positionY = yOperator ? operatorOperations[yOperator](queen.position.y, i) : queen.position.y;
    const passedPosition = new Position(positionX, positionY);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState) || tileIsOccupiedByOpponentKing(passedPosition, boardState, queen.teamType)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, queen.teamType) || tileIsOccupiedByAlly(passedPosition, boardState, queen.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};

// *********************** STANDARD QUEEN MOVE FUNCTIONS *********************** //
export const getStandardQueenMoves = (queen, boardState) => {
  const possibleMoves = [];

  const upMoves = getPossibleQueenLineDiagonalMoves(queen, boardState, undefined, Operator.ADDITION);
  possibleMoves.push(...upMoves);

  const bottomMoves = getPossibleQueenLineDiagonalMoves(queen, boardState, undefined, Operator.SUBTRACTION);
  possibleMoves.push(...bottomMoves);

  const leftMoves = getPossibleQueenLineDiagonalMoves(queen, boardState, Operator.SUBTRACTION, undefined);
  possibleMoves.push(...leftMoves);

  const rightMoves = getPossibleQueenLineDiagonalMoves(queen, boardState, Operator.ADDITION, undefined);
  possibleMoves.push(...rightMoves);

  const upperRightMoves = getPossibleQueenLineDiagonalMoves(queen, boardState, Operator.ADDITION, Operator.ADDITION);
  possibleMoves.push(...upperRightMoves);

  const bottomRightMoves = getPossibleQueenLineDiagonalMoves(queen, boardState, Operator.ADDITION, Operator.SUBTRACTION);
  possibleMoves.push(...bottomRightMoves);

  const upperLeftMoves = getPossibleQueenLineDiagonalMoves(queen, boardState, Operator.SUBTRACTION, Operator.SUBTRACTION);
  possibleMoves.push(...upperLeftMoves);

  const bottomLeftMoves = getPossibleQueenLineDiagonalMoves(queen, boardState, Operator.SUBTRACTION, Operator.ADDITION);
  possibleMoves.push(...bottomLeftMoves);

  return possibleMoves
};

const getPossibleQueenLineDiagonalMoves = (queen, boardState, xOperator, yOperator) => {
  const possibleMoves = [];
  for (let i = 1; i < 8; i++) {
    const positionX = xOperator ? operatorOperations[xOperator](queen.position.x, i) : queen.position.x;
    const positionY = yOperator ? operatorOperations[yOperator](queen.position.y, i) : queen.position.y;
    const passedPosition = new Position(positionX, positionY);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, queen.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};

const validStandardQueenMove = (teamType, boardState, newPosition, grabPosition) => {
  const multiplierX = (newPosition.x < grabPosition.x) ? -1 : (newPosition.x > grabPosition.x) ? 1 : 0;
  const multiplierY = (newPosition.y < grabPosition.y) ? -1 : (newPosition.y > grabPosition.y) ? 1 : 0;

  // ** MOVEMENT/ATTACK LOGIC ** //
  for (let i = 1; i < 8; i++) {
    const passedPosition = new Position(grabPosition.x + (i * multiplierX), grabPosition.y + (i * multiplierY));

    if (samePosition(newPosition, passedPosition)) {
      if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, teamType)) {
        return true;
      }
    } else {
      if (tileIsOccupied(passedPosition, boardState)) {
        break;
      }
    }
  }

  return false;
};
