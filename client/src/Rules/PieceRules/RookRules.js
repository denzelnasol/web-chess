// Utilities
import { samePosition } from "utilities/Position";

// Rules
import { tileIsOccupied, tileIsOccupiedByOpponent, tileIsOccupiedByOpponentKing, tileIsOccupiedByAlly, getPieceFromPosition } from "Rules/GeneralRules";
import { kingIsChecked, getKingCheckPieceMoves } from "Rules/CheckRules";
import { getPinnedPieceMoves, checkIfPiecePinned } from "Rules/PinnedRules";

// Objects
import Position from "models/Position";

// Enums
import { Operator, operatorOperations } from "enums/Operator";

const directions = [
  [undefined, Operator.ADDITION],
  [undefined, Operator.SUBTRACTION],
  [Operator.SUBTRACTION, undefined],
  [Operator.ADDITION, undefined],
];

const isValidRookPosition = (grabPosition, newPosition, teamType, board) => {
  if (teamType !== board.currentPlayer.teamType) return false;
  const rook = getPieceFromPosition(grabPosition, board.pieces);
  const isValidMove = rook.possibleMoves.find((move) => samePosition(move, newPosition));
  return isValidMove;
}

const getPossibleRookMoves = (rook, boardState) => {
  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(rook.teamType, boardState);
  if (isKingCheck) return getKingCheckPieceMoves(rook, boardState);

  // ** ROOK PINNED LOGIC ** //
  const isRookPinned = checkIfPiecePinned(rook, boardState);
  if (isRookPinned) return getPinnedPieceMoves(rook, boardState);

  // ** STANDARD MOVE LOGIC ** //
  return getStandardRookMoves(rook, boardState);
}

// *********************** ROOK ATTACK FUNCTIONS *********************** //
const getPossibleRookAttackMoves = (rook, boardState) => {
  const possibleMoves = [];
  for (const [xOperator, yOperator] of directions) {
    const moves = getRookLineAttackMoves(rook, boardState, xOperator, yOperator);
    possibleMoves.push(...moves);
  }
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
const getStandardRookMoves = (rook, boardState) => {
  const possibleMoves = [];
  for (const [xOperator, yOperator] of directions) {
    const moves = getPossibleRookLineMoves(rook, boardState, xOperator, yOperator);
    possibleMoves.push(...moves);
  }
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

export {
  isValidRookPosition,
  getPossibleRookMoves,
  getPossibleRookAttackMoves,
  getPossibleRookLineMoves,
  getStandardRookMoves
};