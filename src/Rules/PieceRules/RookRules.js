// Utilities
import { samePosition } from "utilities/Position";

// Rules
import { tileIsOccupied, tileIsOccupiedByOpponent, tileIsOccupiedByOpponentKing, tileIsOccupiedByAlly, getPieceFromPosition } from "Rules/GeneralRules";
import { kingIsChecked, getKingCheckPieceMoves } from "Rules/PieceRules/KingRules";
import { getPinnedPieceMoves, checkIfPiecePinned } from "Rules/PinnedRules";

// Objects
import Position from "models/Position";

// Enums
import { Operator, operatorOperations } from "enums/Operator";

export function isValidRookPosition(grabPosition, newPosition, teamType, board) {
  if (teamType !== board.currentPlayer.teamType) return false;
  const rook = getPieceFromPosition(grabPosition, board.pieces);
  const isValidMove = rook.possibleMoves.find((move) => samePosition(move, newPosition));
  return isValidMove;
}

export function getPossibleRookMoves(rook, boardState) {
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
