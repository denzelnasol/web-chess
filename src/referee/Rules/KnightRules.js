// Utilities
import { getPositionPointDifference } from "utilities/Position";

// Rules
import { tileIsEmptyOrOccupiedByOpponent } from "referee/Rules/GeneralRules";

export function isValidKnightPosition(grabPosition, newPosition, teamType, boardState) {
  const xDifference = Math.abs(getPositionPointDifference(newPosition.x, grabPosition.x));
  const yDifference = Math.abs(getPositionPointDifference(newPosition.y, grabPosition.y));

  // ** MOVEMENT/ATTACK LOGIC ** //
  if ((xDifference === 2 && yDifference === 1) || (xDifference === 1 && yDifference === 2)) {
    if (tileIsEmptyOrOccupiedByOpponent(newPosition, boardState, teamType)) {
      return true;
    }
  }

  return false;
}

export function getPossibleKnightMoves(knight, boardState) {
  const possibleMoves = [];


  return possibleMoves;
}
