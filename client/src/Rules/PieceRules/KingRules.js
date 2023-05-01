// Utilities
import { samePosition } from "utilities/Position";

// Rules
import { tileIsOccupied, tileIsOccupiedByOpponent, getOpponentAttackMoves, getPieceFromPosition } from "Rules/GeneralRules";
import { kingIsChecked } from "Rules/CheckRules";

// Models
import Position from "models/Position";

// Enums
import { TeamType } from "enums/TeamType";
import { PieceType } from "enums/PieceType";
import { operatorOperations, Operator } from "enums/Operator";

const isValidKingPosition = (grabPosition, passedPosition, teamType, board) => {
  if (teamType !== board.currentPlayer.teamType) return false;
  const king = getPieceFromPosition(grabPosition, board.pieces);
  const isValidMove = king.possibleMoves.find((move) => samePosition(move, passedPosition));
  return isValidMove;
}

const getPossibleKingMoves = (king, boardState) => {
  const possibleMoves = getStandardKingMoves(king, boardState);

  const kingRow = king.teamType === TeamType.WHITE ? 0 : 7;
  const possibleAttackedMoves = getOpponentAttackMoves(king.teamType, boardState);

  const leftCastleMove = getLeftCastleMove(king, boardState, possibleAttackedMoves, kingRow);
  if (leftCastleMove) possibleMoves.push(leftCastleMove);

  const rightCastleMove = getRightCastleMove(king, boardState, possibleAttackedMoves, kingRow);
  if (rightCastleMove) possibleMoves.push(rightCastleMove);

  // Filter out positions being attacked
  return possibleMoves.filter((move) => !possibleAttackedMoves.some((attackMove) => samePosition(move, attackMove)));
}

// *********************** STANDARD KING MOVE FUNCTIONS *********************** //
const getStandardKingMoves = (king, boardState, attackMove) => {
  const possibleMoves = [];

  const upMoves = getPossibleKingLineMoves(king, boardState, undefined, Operator.ADDITION, attackMove);
  possibleMoves.push(...upMoves);

  const bottomMoves = getPossibleKingLineMoves(king, boardState, undefined, Operator.SUBTRACTION, attackMove);
  possibleMoves.push(...bottomMoves);

  const leftMoves = getPossibleKingLineMoves(king, boardState, Operator.SUBTRACTION, undefined, attackMove);
  possibleMoves.push(...leftMoves);

  const rightMoves = getPossibleKingLineMoves(king, boardState, Operator.ADDITION, undefined, attackMove);
  possibleMoves.push(...rightMoves);

  const upperRightMoves = getPossibleKingDiagonalMoves(king, boardState, Operator.ADDITION, Operator.ADDITION, attackMove);
  possibleMoves.push(...upperRightMoves);

  const bottomRightMoves = getPossibleKingDiagonalMoves(king, boardState, Operator.ADDITION, Operator.SUBTRACTION, attackMove);
  possibleMoves.push(...bottomRightMoves);

  const upperLeftMoves = getPossibleKingDiagonalMoves(king, boardState, Operator.SUBTRACTION, Operator.SUBTRACTION, attackMove);
  possibleMoves.push(...upperLeftMoves);

  const bottomLeftMoves = getPossibleKingDiagonalMoves(king, boardState, Operator.SUBTRACTION, Operator.ADDITION, attackMove);
  possibleMoves.push(...bottomLeftMoves);

  return possibleMoves
};

const getPossibleKingLineMoves = (king, boardState, xOperator, yOperator, attackMove) => {
  const possibleMoves = [];
  for (let i = 1; i < 2; i++) {
    const positionX = xOperator ? operatorOperations[xOperator](king.position.x, i) : king.position.x;
    const positionY = yOperator ? operatorOperations[yOperator](king.position.y, i) : king.position.y;
    const passedPosition = new Position(positionX, positionY);
    if (passedPosition.outOfBounds()) continue;

    if (attackMove) {
      possibleMoves.push(passedPosition);
      continue;
    }

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, king.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};

const getPossibleKingDiagonalMoves = (king, boardState, xOperator, yOperator, attackMove) => {
  const possibleMoves = [];
  for (let i = 1; i < 2; i++) {
    const positionX = operatorOperations[xOperator](king.position.x, i);
    const positionY = operatorOperations[yOperator](king.position.y, i);
    const passedPosition = new Position(positionX, positionY);
    if (passedPosition.outOfBounds()) continue;

    if (attackMove) {
      possibleMoves.push(passedPosition);
      continue;
    }

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, king.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};

const getLeftCastleMove = (king, boardState, possibleAttackedMoves, kingRow) => {
  const isKingChecked = kingIsChecked(king.teamType, boardState);

  // Left Castle
  const leftKnightPosition = new Position(1, kingRow);
  const leftBishopPosition = new Position(2, kingRow);

  const isLeftKnightPositionEmpty = !tileIsOccupied(leftKnightPosition, boardState);
  const isLeftBishopPositionEmpty = !tileIsOccupied(leftBishopPosition, boardState);

  const isLeftKnightPositionAttacked = possibleAttackedMoves.find((move) => samePosition(move, leftKnightPosition));
  const isLeftBishopPositionAttacked = possibleAttackedMoves.find((move) => samePosition(move, leftBishopPosition));

  if (isLeftKnightPositionEmpty && isLeftBishopPositionEmpty && king.castleAvailable && !isLeftKnightPositionAttacked && !isLeftBishopPositionAttacked && !isKingChecked) {
    const rook = boardState.find((piece) => samePosition(new Position(0, kingRow), piece.position) && piece.castleAvailable);
    if (!rook) return null;
    return new Position(1, kingRow);
  }
  return null;
};

const getRightCastleMove = (king, boardState, possibleAttackedMoves, kingRow) => {
  const isKingChecked = kingIsChecked(king.teamType, boardState);

  const rightKnightPosition = new Position(6, kingRow);
  const rightBishopPosition = new Position(5, kingRow);
  const queenPosition = new Position(4, kingRow);

  const isRightKnightPositionEmpty = !tileIsOccupied(rightKnightPosition, boardState);
  const isRightBishopPositionEmpty = !tileIsOccupied(rightBishopPosition, boardState);
  const isQueenPositionEmpty = !tileIsOccupied(queenPosition, boardState);

  const isRightKnightPositionAttacked = possibleAttackedMoves.find((move) => samePosition(move, rightKnightPosition));
  const isRightBishopPositionAttacked = possibleAttackedMoves.find((move) => samePosition(move, rightBishopPosition));
  const isQueenPositionAttacked = possibleAttackedMoves.find((move) => samePosition(move, queenPosition));

  if (isRightKnightPositionEmpty && isRightBishopPositionEmpty && isQueenPositionEmpty && king.castleAvailable && !isRightKnightPositionAttacked && !isRightBishopPositionAttacked && !isQueenPositionAttacked && !isKingChecked) {
    const rook = boardState.find((piece) => samePosition(new Position(7, kingRow), piece.position) && piece.castleAvailable);
    if (!rook) return null;
    return new Position(5, kingRow);
  }
  return null;
};

const getKing = (teamType, boardState) => {
  return boardState.find((piece) => piece.type === PieceType.KING && piece.teamType === teamType);
}

export {
  isValidKingPosition,
  getPossibleKingMoves,
  getStandardKingMoves,
  getKing
};