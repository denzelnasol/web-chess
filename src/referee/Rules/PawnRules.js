// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from "enums/TeamType";

// Utilities
import { samePosition, getPositionPointDifference, sameColumn } from "utilities/Position";

// Rules
import { tileIsOccupied, tileIsOccupiedByOpponent } from "referee/Rules/GeneralRules";

// Objects
import Position from "objects/Position";

export function moveIsEnpassant(grabPosition, newPosition, boardState, type, teamType) {
  const pawnDirection = teamType === TeamType.WHITE ? 1 : -1;
  const xDifference = getPositionPointDifference(newPosition.x, grabPosition.x);
  const yDifference = getPositionPointDifference(newPosition.y, grabPosition.y);
  if (type !== PieceType.PAWN) return false;

  if ((xDifference === -1 || xDifference === 1) && yDifference === pawnDirection) {
    const piece = boardState.find((piece) =>
      samePosition(piece.position, new Position(newPosition.x, newPosition.y - pawnDirection)) && piece.enPassant
    );
    if (piece) return true;
  }
  return false;
}

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
