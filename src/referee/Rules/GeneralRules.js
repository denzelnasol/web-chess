// Utilities
import { samePosition } from "utilities/Position";

export function tileIsEmptyOrOccupiedByOpponent(newPosition, boardState, teamType) {
  return !tileIsOccupied(newPosition, boardState) || tileIsOccupiedByOpponent(newPosition, boardState, teamType);
}

export function tileIsOccupied(newPosition, boardState) {
  const piece = boardState.find((p) => samePosition(p.position, newPosition));
  return piece ? true : false;
}

export function tileIsOccupiedByOpponent(newPosition, boardState, teamType) {
  const piece = boardState.find((p) => samePosition(p.position, newPosition) && p.teamType !== teamType);
  return piece ? true : false;
}
