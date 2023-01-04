// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from "enums/TeamType";

// Utilities
import { samePosition, getPositionPointDifference, sameColumn } from "utilities/Position";

// Rules
import { checkIfPiecePinned, getPieceFromPosition, tileIsOccupied, tileIsOccupiedByOpponent, checkPinnedPiecePotentialMove } from "referee/Rules/GeneralRules";
import { getPieceCheckPath, getPiecesAttackingKing, kingIsChecked, validKingCheckMove } from "referee/Rules/KingRules";

// Objects
import Position from "models/Position";

export const moveIsPawnPromotion = (newPosition, type, teamType) => {
  const promotionRow = teamType === TeamType.WHITE ? 7 : 0;

  if (type !== PieceType.PAWN) return false;
  if (newPosition.y === promotionRow) return true;

  return false;
};

export const isValidPawnPosition = (grabPosition, newPosition, teamType, boardState) => {
  const pawn = getPieceFromPosition(grabPosition, boardState);
  const possiblePawnMoves = getPossiblePawnMoves(pawn, boardState);

  // ** PAWN PINNED LOGIC ** //
  const isPawnPinned = checkIfPiecePinned(pawn, boardState);
  if (isPawnPinned) {
    const isPinnedPawnMoveValid = validPinnedPawnMove(pawn, boardState, newPosition);
    return isPinnedPawnMoveValid;
  }

  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(teamType, boardState);
  if (isKingCheck) {
    const isKingThreatenedPawnMoveValid = validKingCheckMove(teamType, boardState, newPosition, possiblePawnMoves);
    return isKingThreatenedPawnMoveValid;
  }

  // ** STANDARD MOVE LOGIC ** //
  const isStandardPawnMoveValid = validStandardPawnMove(pawn, boardState, newPosition, grabPosition);
  return isStandardPawnMoveValid;
};

export const getPossiblePawnMoves = (pawn, boardState) => {
  // ** PAWN PINNED LOGIC ** //
  const isPawnPinned = checkIfPiecePinned(pawn, boardState);
  if (isPawnPinned) {
    const pinnedPawnMoves = getPinnedPawnMoves(pawn, boardState);
    return pinnedPawnMoves;
  }

  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(pawn.teamType, boardState);
  if (isKingCheck) {
    const kingThreatenedPawnMoves = getKingCheckPawnMoves(pawn, boardState);
    return kingThreatenedPawnMoves;
  }

  // ** STANDARD MOVE LOGIC ** //
  const standardPawnMoves = getStandardPawnMoves(pawn, boardState);
  return standardPawnMoves;
};

export const getPossiblePawnAttackMoves = (pawn) => {
  const possibleMoves = [];
  const pawnDirection = (pawn.teamType === TeamType.WHITE ? 1 : -1);
  const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);

  possibleMoves.push(upperLeftAttack);
  possibleMoves.push(upperRightAttack);

  return possibleMoves
}

// *********************** KING CHECK PAWN MOVE FUNCTIONS *********************** //
const getKingCheckPawnMoves = (pawn, boardState) => {
  const possibleMoves = [];
  const piecesAttackingKing = getPiecesAttackingKing(pawn.teamType, boardState);
  const pawnDirection = (pawn.teamType === TeamType.WHITE ? 1 : -1);
  const initialPawnRow = (pawn.teamType === TeamType.WHITE ? 1 : 6);
  
  const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection);
  const specialMove = new Position(normalMove.x, normalMove.y + pawnDirection);
  const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);
  
  piecesAttackingKing.forEach((piece) => {
    const pieceCheckPath = getPieceCheckPath(piece, pawn.teamType, boardState);

    const isSpecialMovePossible = pieceCheckPath.find((move) =>
      samePosition(move, specialMove) && !tileIsOccupied(move, boardState) && !tileIsOccupied(normalMove, boardState) && pawn.position.y === initialPawnRow
    );
    if (isSpecialMovePossible) possibleMoves.push(specialMove);

    const isNormalMovePossible = pieceCheckPath.find((move) =>
      samePosition(move, normalMove) && !tileIsOccupied(move, boardState)
    );
    if (isNormalMovePossible) possibleMoves.push(normalMove);

    const isUpperLeftAttackPossible = pieceCheckPath.find((move) =>
      samePosition(move, upperLeftAttack) && tileIsOccupiedByOpponent(move, boardState, pawn.teamType)
    );
    if (isUpperLeftAttackPossible) possibleMoves.push(upperLeftAttack);

    const isUpperRightAttackPossible = pieceCheckPath.find((move) =>
      samePosition(move, upperRightAttack) && tileIsOccupiedByOpponent(move, boardState, pawn.teamType)
    );
    if (isUpperRightAttackPossible) possibleMoves.push(upperRightAttack);
  });

  return possibleMoves;
};

// *********************** PINNED PAWN MOVE FUNCTIONS *********************** //
const getPinnedPawnMoves = (pawn, boardState) => {
  const possibleMoves = [];
  const initialPawnRow = (pawn.teamType === TeamType.WHITE ? 1 : 6);
  const pawnDirection = (pawn.teamType === TeamType.WHITE ? 1 : -1);

  const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection);
  const specialMove = new Position(normalMove.x, normalMove.y + pawnDirection);
  const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);

  if (!tileIsOccupied(normalMove, boardState)) {
    const isNormalMovePossible = checkPinnedPiecePotentialMove(normalMove, pawn, boardState);
    if (isNormalMovePossible) possibleMoves.push(normalMove);

    if (!tileIsOccupied(specialMove, boardState) && pawn.position.y === initialPawnRow) {
      const isSpecialMovePossible = checkPinnedPiecePotentialMove(specialMove, pawn, boardState);
      if (isSpecialMovePossible) possibleMoves.push(specialMove);
    }
  } else if (tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.teamType)) {
    const isUpperLeftAttackPossible = checkPinnedPiecePotentialMove(upperLeftAttack, pawn, boardState);
    if (isUpperLeftAttackPossible) possibleMoves.push(upperLeftAttack);
  } else if (tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.teamType)) {
    const isUpperRightAttackPossible = checkPinnedPiecePotentialMove(upperRightAttack, pawn, boardState);
    if (isUpperRightAttackPossible) possibleMoves.push(upperRightAttack);
  }

  return possibleMoves;
};

const validPinnedPawnMove = (pawn, boardState, newPosition) => {
  const initialPawnRow = (pawn.teamType === TeamType.WHITE ? 1 : 6);
  const pawnDirection = (pawn.teamType === TeamType.WHITE ? 1 : -1);

  const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection);
  const specialMove = new Position(normalMove.x, normalMove.y + pawnDirection);
  const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);

  let isMoveValid = false;

  if (!tileIsOccupied(normalMove, boardState) && samePosition(normalMove, newPosition)) {
    const isNormalMovePossible = checkPinnedPiecePotentialMove(normalMove, pawn, boardState);
    if (isNormalMovePossible) isMoveValid = true;
  } else if (!tileIsOccupied(normalMove, boardState) && !tileIsOccupied(specialMove, boardState) && pawn.position.y === initialPawnRow && samePosition(specialMove, newPosition)) {
    const isSpecialMovePossible = checkPinnedPiecePotentialMove(specialMove, pawn, boardState);
    if (isSpecialMovePossible) isMoveValid = true;
  } else if (tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.teamType) && samePosition(upperLeftAttack, newPosition)) {
    const isUpperLeftAttackPossible = checkPinnedPiecePotentialMove(upperLeftAttack, pawn, boardState);
    if (isUpperLeftAttackPossible) isMoveValid = true;
  } else if (tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.teamType) && samePosition(upperRightAttack, newPosition)) {
    const isUpperRightAttackPossible = checkPinnedPiecePotentialMove(upperRightAttack, pawn, boardState);
    if (isUpperRightAttackPossible) isMoveValid = true;
  }

  return isMoveValid;
};

// *********************** STANDARD PAWN MOVE FUNCTIONS *********************** //
const getStandardPawnMoves = (pawn, boardState) => {
  const possibleMoves = [];

  const initialPawnRow = (pawn.teamType === TeamType.WHITE ? 1 : 6);
  const pawnDirection = (pawn.teamType === TeamType.WHITE ? 1 : -1);

  const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection);
  const specialMove = new Position(normalMove.x, normalMove.y + pawnDirection);
  const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);
  const leftPosition = new Position(pawn.position.x - 1, pawn.position.y);
  const rightPosition = new Position(pawn.position.x + 1, pawn.position.y);

  if (!tileIsOccupied(normalMove, boardState)) {
    possibleMoves.push(normalMove);

    if (pawn.position.y === initialPawnRow && !tileIsOccupied(specialMove, boardState)) {
      possibleMoves.push(specialMove);
    }
  }

  if (tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.teamType)) {
    possibleMoves.push(upperLeftAttack);
  } else if (!tileIsOccupied(upperLeftAttack, boardState)) {
    const leftPiece = boardState.find(piece => samePosition(piece.position, leftPosition));
    if (leftPiece != null && leftPiece.enPassant) {
      possibleMoves.push(upperLeftAttack);
    }
  }

  if (tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.teamType)) {
    possibleMoves.push(upperRightAttack);
  } else if (!tileIsOccupied(upperRightAttack, boardState)) {
    const rightPiece = boardState.find(piece => samePosition(piece.position, rightPosition));
    if (rightPiece != null && rightPiece.enPassant) {
      possibleMoves.push(upperRightAttack);
    }
  }
  return possibleMoves;
};

const validStandardPawnMove = (pawn, boardState, newPosition, grabPosition) => {
  const initialPawnRow = (pawn.teamType === TeamType.WHITE ? 1 : 6)
  const pawnDirection = (pawn.teamType === TeamType.WHITE ? 1 : -1);
  const isSameColumn = (sameColumn(grabPosition, newPosition));
  const xDifference = getPositionPointDifference(newPosition.x, grabPosition.x);
  const yDifference = getPositionPointDifference(newPosition.y, grabPosition.y);

  // ** MOVEMENT LOGIC ** //
  // check if pawn is at initial position, no piece blocks it moving forward, and may move two spaces forward
  if (isSameColumn && grabPosition.y === initialPawnRow && yDifference === 2 * pawnDirection) {
    if (!tileIsOccupied(newPosition, boardState) && !tileIsOccupied(new Position(newPosition.x, newPosition.y - pawnDirection), boardState)) {
      return true;
    }
  } else if (isSameColumn && yDifference === pawnDirection) {
    if (!tileIsOccupied(newPosition, boardState)) {
      return true;
    }
  }

  // ** ATTACK LOGIC ** //
  if ((xDifference === -1 || xDifference === 1) && yDifference === pawnDirection) {
    const isTileOccupied = tileIsOccupiedByOpponent(newPosition, boardState, pawn.teamType);
    if (isTileOccupied) {
      return true;
    }
  }
};
