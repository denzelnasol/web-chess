// Utilities
import { samePosition } from "utilities/Position";

// Rules
import { tileIsOccupied, tileIsOccupiedByOpponent, tileIsOccupiedByOpponentKing, tileIsOccupiedByAlly, getPieceFromPosition } from "Rules/GeneralRules";
import { kingIsChecked, getKingCheckPieceMoves } from "Rules/PieceRules/KingRules";

import { checkIfPiecePinned, getPinnedPieceMoves } from "Rules/PinnedRules";

// Enums
import { Operator, operatorOperations } from "enums/Operator";

// Objects
import Position from "models/Position";

export const isValidBishopPosition = (grabPosition, newPosition, teamType, board) => {
  if (teamType !== board.currentPlayer.teamType) return false;
  const bishop = getPieceFromPosition(grabPosition, board.pieces);
  const isValidMove = bishop.possibleMoves.find((move) => samePosition(move, newPosition));
  return isValidMove;
};

export const getPossibleBishopMoves = (bishop, boardState) => {
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
