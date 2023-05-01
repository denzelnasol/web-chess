// Utilities
import { samePosition } from "utilities/Position";

// Enums
import { Operator, operatorOperations } from "enums/Operator";

// Rules
import { tileIsOccupied, tileIsOccupiedByOpponent, tileIsOccupiedByOpponentKing, tileIsOccupiedByAlly, getPieceFromPosition } from "Rules/GeneralRules";
import { getPinnedPieceMoves, checkIfPiecePinned } from "Rules/PinnedRules";
import { kingIsChecked, getKingCheckPieceMoves } from "Rules/CheckRules";

// Objects
import Position from "models/Position";

const directions = [
  [undefined, Operator.ADDITION],
  [undefined, Operator.SUBTRACTION],
  [Operator.SUBTRACTION, undefined],
  [Operator.ADDITION, undefined],
  [Operator.ADDITION, Operator.ADDITION],
  [Operator.ADDITION, Operator.SUBTRACTION],
  [Operator.SUBTRACTION, Operator.SUBTRACTION],
  [Operator.SUBTRACTION, Operator.ADDITION],
];

const isValidQueenPosition = (grabPosition, newPosition, teamType, board) => {
  if (teamType !== board.currentPlayer.teamType) return false;
  const queen = getPieceFromPosition(grabPosition, board.pieces);
  return queen.possibleMoves.some((move) => samePosition(move, newPosition));
}

const getPossibleQueenMoves = (queen, boardState) => {
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
const getPossibleQueenAttackMoves = (queen, boardState) => {
  const possibleMoves = [];
  for (const [xOperator, yOperator] of directions) {
    const moves = getQueenDirectionalAttackMoves(queen, boardState, xOperator, yOperator);
    possibleMoves.push(...moves);
  }

  return possibleMoves
}

const getQueenDirectionalAttackMoves = (queen, boardState, xOperator, yOperator) => {
  const possibleMoves = [];
  for (let i = 1; i < 8; i++) {
    const positionX = xOperator ? operatorOperations[xOperator](queen.position.x, i) : queen.position.x;
    const positionY = yOperator ? operatorOperations[yOperator](queen.position.y, i) : queen.position.y;
    const passedPosition = new Position(positionX, positionY);
    if (passedPosition.outOfBounds()) break;

    if (tileIsOccupied(passedPosition, boardState)) {
      if (tileIsOccupiedByAlly(passedPosition, boardState, queen.teamType)) {
        break;
      } else {
        possibleMoves.push(passedPosition);
        break;
      }
    } else {
      possibleMoves.push(passedPosition);
    }
  }

  return possibleMoves;
};

// *********************** STANDARD QUEEN MOVE FUNCTIONS *********************** //
const getStandardQueenMoves = (queen, boardState) => {
  const possibleMoves = [];
  for (const [xOperator, yOperator] of directions) {
    const moves = getPossibleQueenLineDiagonalMoves(queen, boardState, xOperator, yOperator);
    possibleMoves.push(...moves);
  }

  return possibleMoves;
};

const getPossibleQueenLineDiagonalMoves = (queen, boardState, xOperator, yOperator) => {
  const possibleMoves = [];
  let shouldStopAddingMoves = false;
  
  for (let i = 1; i < 8 && !shouldStopAddingMoves; i++) {
    const positionX = xOperator ? operatorOperations[xOperator](queen.position.x, i) : queen.position.x;
    const positionY = yOperator ? operatorOperations[yOperator](queen.position.y, i) : queen.position.y;
    const passedPosition = new Position(positionX, positionY);

    if (passedPosition.outOfBounds()) {
      shouldStopAddingMoves = true;
    } else if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, queen.teamType)) {
      possibleMoves.push(passedPosition);
      shouldStopAddingMoves = true;
    } else {
      shouldStopAddingMoves = true;
    }
  }

  return possibleMoves;
};

export {
  isValidQueenPosition,
  getPossibleQueenMoves,
  getPossibleQueenAttackMoves,
  getStandardQueenMoves
};