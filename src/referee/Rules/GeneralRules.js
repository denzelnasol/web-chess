// Utilities
import { samePosition } from "utilities/Position";

// Enums
import { PieceType } from "enums/PieceType";

export function tileIsEmptyOrOccupiedByOpponent(newPosition, boardState, teamType) {
  return !tileIsOccupied(newPosition, boardState) || tileIsOccupiedByOpponent(newPosition, boardState, teamType);
}

export function tileIsOccupied(newPosition, boardState) {
  const piece = boardState.find((p) => samePosition(p.position, newPosition));
  return piece;
}

export function tileIsOccupiedByOpponent(newPosition, boardState, teamType) {
  const piece = boardState.find((p) => samePosition(p.position, newPosition) && p.teamType !== teamType);
  return piece;
}

export function tileIsOccupiedByOpponentKing(newPosition, boardState, teamType) {
  const piece = boardState.find((p) => samePosition(p.position, newPosition) && p.teamType !== teamType && p.type === PieceType.KING);
  return piece;
}