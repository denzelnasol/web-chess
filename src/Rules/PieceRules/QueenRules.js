// Utilities
import { samePosition } from "utilities/Position";

// Enums
import { Operator, operatorOperations } from "enums/Operator";

// Rules
import { getKingCheckPieceMoves, kingIsChecked } from "Rules/PieceRules/KingRules";
import { tileIsOccupied, tileIsOccupiedByOpponent, tileIsOccupiedByOpponentKing, tileIsOccupiedByAlly, getPieceFromPosition } from "Rules/GeneralRules";
import { getPinnedPieceMoves, checkIfPiecePinned } from "Rules/PinnedRules";

// Objects
import Position from "models/Position";

export function isValidQueenPosition(grabPosition, newPosition, teamType, board) {
  if (teamType !== board.currentPlayer.teamType) return false;
  const queen = getPieceFromPosition(grabPosition, board.pieces);
  const isValidMove = queen.possibleMoves.find((move) => samePosition(move, newPosition));
  return isValidMove;
}

export function getPossibleQueenMoves(queen, boardState) {
  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(queen.teamType, boardState);
  if (isKingCheck) return getKingCheckPieceMoves(queen, boardState);

  // ** QUEEN PINNED LOGIC ** //
  const isQueenPinned = checkIfPiecePinned(queen, boardState);
  if (isQueenPinned) return getPinnedPieceMoves(queen, boardState);

  // ** STANDARD MOVE LOGIC ** //
  return getStandardQueenMoves(queen, boardState);

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
