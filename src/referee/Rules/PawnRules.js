// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from "enums/TeamType";

// Utilities
import { samePosition, getPositionPointDifference, sameColumn } from "utilities/Position";

// Rules
import { checkIfPiecePinned, getPieceAttackMoves, getPieceFromPosition, tileIsOccupied, tileIsOccupiedByOpponent } from "referee/Rules/GeneralRules";
import { getPieceCheckPath, getPiecesAttackingKing, kingIsThreatened } from "referee/Rules/KingRules";

// Objects
import Position from "models/Position";

export function moveIsPawnPromotion(newPosition, type, teamType) {
  const promotionRow = teamType === TeamType.WHITE ? 7 : 0;

  if (type !== PieceType.PAWN) return false;
  if (newPosition.y === promotionRow) return true;

  return false;
}

export function isValidPawnPosition(grabPosition, newPosition, teamType, boardState) {
  const initialPawnRow = (teamType === TeamType.WHITE ? 1 : 6)
  const pawnDirection = (teamType === TeamType.WHITE ? 1 : -1);
  const isSameColumn = (sameColumn(grabPosition, newPosition));
  const xDifference = getPositionPointDifference(newPosition.x, grabPosition.x);
  const yDifference = getPositionPointDifference(newPosition.y, grabPosition.y);

  const pawn = getPieceFromPosition(grabPosition, boardState);
  const possiblePawnMoves = getPossiblePawnMoves(pawn, boardState);

  // King in check logic
  const isKingThreatened = kingIsThreatened(teamType, boardState);
  if (isKingThreatened) {
    const isKingThreatenedPawnMoveValid = kingThreatenedValidPawnMove(teamType, boardState, newPosition, possiblePawnMoves);
    return isKingThreatenedPawnMoveValid;
  }

  const isPawnPinned = checkIfPiecePinned(pawn, boardState);
  if (isPawnPinned) return false;

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
    const isTileOccupied = tileIsOccupiedByOpponent(newPosition, boardState, teamType);
    if (isTileOccupied) {
      return true;
    }
  }

  return false;
}

export function getPossiblePawnMoves(pawn, boardState) {
  const possibleMoves = [];

  const initialPawnRow = (pawn.teamType === TeamType.WHITE ? 1 : 6);
  const pawnDirection = (pawn.teamType === TeamType.WHITE ? 1 : -1);

  const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection);
  const specialMove = new Position(normalMove.x, normalMove.y + pawnDirection);
  const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);
  const leftPosition = new Position(pawn.position.x - 1, pawn.position.y);
  const rightPosition = new Position(pawn.position.x + 1, pawn.position.y);

  const isKingThreatened = kingIsThreatened(pawn.teamType, boardState);
  if (isKingThreatened) {
    const kingThreatenedPawnMoves = getKingThreatenedPawnMoves(pawn, boardState);
    return kingThreatenedPawnMoves;
  }

  const isPawnPinned = checkIfPiecePinned(pawn, boardState);
  if (isPawnPinned) return possibleMoves;

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
}

export const getPossiblePawnAttackMoves = (pawn) => {
  const possibleMoves = [];
  const pawnDirection = (pawn.teamType === TeamType.WHITE ? 1 : -1);
  const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);

  possibleMoves.push(upperLeftAttack);
  possibleMoves.push(upperRightAttack);

  return possibleMoves
}

const getKingThreatenedPawnMoves = (pawn, boardState) => {
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

const kingThreatenedValidPawnMove = (teamType, boardState, newPosition, possiblePawnMoves) => {
  const piecesAttackingKing = getPiecesAttackingKing(teamType, boardState);
  for (const piece of piecesAttackingKing) {
    const pieceCheckPath = getPieceCheckPath(piece, teamType, boardState)
    let checkPathBlocked = false;
    for (const possiblePawnMove of possiblePawnMoves) {
      checkPathBlocked = pieceCheckPath.find((move) =>
        samePosition(possiblePawnMove, move) && samePosition(possiblePawnMove, newPosition)
      );
      if (checkPathBlocked) break;
    }
    if (!checkPathBlocked) return false;
  }
  return true;
};
