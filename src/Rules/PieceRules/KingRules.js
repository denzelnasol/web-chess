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

export function isValidKingPosition(grabPosition, passedPosition, teamType, board, castleAvailable) {
  if (teamType !== board.currentPlayer.teamType) return false;
  const king = getPieceFromPosition(grabPosition, board.pieces);
  const isValidMove = king.possibleMoves.find((move) => samePosition(move, passedPosition));
  return isValidMove;
}

export function getPossibleKingMoves(king, boardState) {
  let possibleMoves = [];
  
  possibleMoves = getStandardKingMoves(king, boardState);
  
  const kingRow = king.teamType === TeamType.WHITE ? 0 : 7;
  const possibleAttackedMoves = getOpponentAttackMoves(king.teamType, boardState);

  const leftCastleMove = getLeftCastleMove(king, boardState, possibleAttackedMoves, kingRow);
  if (leftCastleMove) possibleMoves.push(leftCastleMove);

  const rightCastleMove = getRightCastleMove(king, boardState, possibleAttackedMoves, kingRow);
  if (rightCastleMove) possibleMoves.push(rightCastleMove);

  // Filter out positions being attacked
  possibleMoves = possibleMoves.filter((move) =>
    !possibleAttackedMoves.some((attackMove) => samePosition(move, attackMove))
  );

  return possibleMoves;
}

// *********************** STANDARD KING MOVE FUNCTIONS *********************** //
export const getStandardKingMoves = (king, boardState) => {
  const possibleMoves = [];

  const upMoves = getPossibleKingLineMoves(king, boardState, undefined, Operator.ADDITION);
  possibleMoves.push(...upMoves);

  const bottomMoves = getPossibleKingLineMoves(king, boardState, undefined, Operator.SUBTRACTION);
  possibleMoves.push(...bottomMoves);

  const leftMoves = getPossibleKingLineMoves(king, boardState, Operator.SUBTRACTION, undefined);
  possibleMoves.push(...leftMoves);

  const rightMoves = getPossibleKingLineMoves(king, boardState, Operator.ADDITION, undefined);
  possibleMoves.push(...rightMoves);

  const upperRightMoves = getPossibleKingDiagonalMoves(king, boardState, Operator.ADDITION, Operator.ADDITION);
  possibleMoves.push(...upperRightMoves);

  const bottomRightMoves = getPossibleKingDiagonalMoves(king, boardState, Operator.ADDITION, Operator.SUBTRACTION);
  possibleMoves.push(...bottomRightMoves);

  const upperLeftMoves = getPossibleKingDiagonalMoves(king, boardState, Operator.SUBTRACTION, Operator.SUBTRACTION);
  possibleMoves.push(...upperLeftMoves);

  const bottomLeftMoves = getPossibleKingDiagonalMoves(king, boardState, Operator.SUBTRACTION, Operator.ADDITION);
  possibleMoves.push(...bottomLeftMoves);

  return possibleMoves
};

const getPossibleKingLineMoves = (king, boardState, xOperator, yOperator) => {
  const possibleMoves = [];
  for (let i = 1; i < 2; i++) {
    const positionX = xOperator ? operatorOperations[xOperator](king.position.x, i) : king.position.x;
    const positionY = yOperator ? operatorOperations[yOperator](king.position.y, i) : king.position.y;
    const passedPosition = new Position(positionX, positionY);
    if (passedPosition.outOfBounds()) continue;

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

const getPossibleKingDiagonalMoves = (king, boardState, xOperator, yOperator) => {
  const possibleMoves = [];
  for (let i = 1; i < 2; i++) {
    const positionX = operatorOperations[xOperator](king.position.x, i);
    const positionY = operatorOperations[yOperator](king.position.y, i);
    const passedPosition = new Position(positionX, positionY);
    if (passedPosition.outOfBounds()) continue;

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

  const isLeftKnightPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, leftKnightPosition)
  );

  const isLeftBishopPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, leftBishopPosition)
  );

  if (isLeftKnightPositionEmpty && isLeftBishopPositionEmpty && king.castleAvailable && !isLeftKnightPositionAttacked && !isLeftBishopPositionAttacked && !isKingChecked) {
    const rook = boardState.find((piece) =>
      samePosition(new Position(0, kingRow), piece.position) && piece.castleAvailable
    );

    if (rook) {
      const passedPosition = new Position(1, kingRow);
      return passedPosition;
    }
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

  const isRightKnightPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, rightKnightPosition)
  );

  const isRightBishopPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, rightBishopPosition)
  );

  const isQueenPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, queenPosition)
  );

  if (isRightKnightPositionEmpty && isRightBishopPositionEmpty && isQueenPositionEmpty && king.castleAvailable && !isRightKnightPositionAttacked && !isRightBishopPositionAttacked && !isQueenPositionAttacked && !isKingChecked) {
    const rook = boardState.find((piece) =>
      samePosition(new Position(7, kingRow), piece.position) && piece.castleAvailable
    );

    if (rook) {
      const passedPosition = new Position(5, kingRow);
      return passedPosition;
    }
  }

  return null;

};

export const getKing = (teamType, boardState) => {
  const king = boardState.find((piece) =>
    piece.type === PieceType.KING && piece.teamType === teamType
  );
  return king;
}