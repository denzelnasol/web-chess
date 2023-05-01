// Utilities
import { samePosition } from "utilities/Position";

// Rules
import { tileIsOccupied, tileIsOccupiedByOpponent, tileIsOccupiedByOpponentKing, tileIsOccupiedByAlly, getPieceFromPosition } from "Rules/GeneralRules";
import { kingIsChecked, getKingCheckPieceMoves } from "Rules/CheckRules";
import { checkIfPiecePinned, getPinnedPieceMoves } from "Rules/PinnedRules";

// Enums
import { Operator, operatorOperations } from "enums/Operator";

// Objects
import Position from "models/Position";

const directions = [
  [Operator.ADDITION, Operator.ADDITION],
  [Operator.ADDITION, Operator.SUBTRACTION],
  [Operator.SUBTRACTION, Operator.SUBTRACTION],
  [Operator.SUBTRACTION, Operator.ADDITION]
];

const isValidBishopPosition = (grabPosition, newPosition, teamType, board) => {
  if (teamType !== board.currentPlayer.teamType) return false;
  const bishop = getPieceFromPosition(grabPosition, board.pieces);
  return bishop.possibleMoves.some((move) => samePosition(move, newPosition));
}

const getPossibleBishopMoves = (bishop, boardState) => {
  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(bishop.teamType, boardState);
  if (isKingCheck) return getKingCheckPieceMoves(bishop, boardState);

  // ** BISHOP PINNED LOGIC ** //
  const isBishopPinned = checkIfPiecePinned(bishop, boardState);
  if (isBishopPinned) return getPinnedPieceMoves(bishop, boardState);

  // ** STANDARD MOVE LOGIC ** //
  return getStandardBishopMoves(bishop, boardState);
};

// *********************** BISHOP ATTACK FUNCTIONS *********************** //
const getPossibleBishopAttackMoves = (bishop, boardState) => {
  const possibleMoves = [];

  for (const [xOperator, yOperator] of directions) {
    possibleMoves.push(...getBishopDiagonalAttackMoves(bishop, boardState, xOperator, yOperator));
  }

  return possibleMoves;
}

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
const getStandardBishopMoves = (bishop, boardState) => {
  const possibleMoves = [];

  for (const [xOperator, yOperator] of directions) {
    const diagonalMoves = getPossibleBishopDiagonalMoves(bishop, boardState, xOperator, yOperator);
    possibleMoves.push(...diagonalMoves);
  }

  return possibleMoves;
};  

const getPossibleBishopDiagonalMoves = (bishop, boardState, xOperator, yOperator) => {
  const possibleMoves = [];
  for (let i = 1; i < 8; i++) {
    const positionX = operatorOperations[xOperator](bishop.position.x, i);
    const positionY = operatorOperations[yOperator](bishop.position.y, i);
    const passedPosition = new Position(positionX, positionY);

    if (passedPosition.outOfBounds()) break;

    if (tileIsOccupiedByOpponent(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    }

    if (tileIsOccupied(passedPosition, boardState)) break;
    
    possibleMoves.push(passedPosition);
  }

  return possibleMoves;
}

export {
  isValidBishopPosition,
  getPossibleBishopMoves,
  getPossibleBishopAttackMoves,
  getStandardBishopMoves
};