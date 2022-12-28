// Utilities
import { getPositionPointDifference } from "utilities/Position";

// Rules
import { tileIsEmptyOrOccupiedByOpponent } from "referee/Rules/GeneralRules";

export function isValidKingPosition(grabPosition, newPosition, teamType, boardState) {
  const xDifference = Math.abs(getPositionPointDifference(newPosition.x, grabPosition.x));
  const yDifference = Math.abs(getPositionPointDifference(newPosition.y, grabPosition.y));

  // ** MOVEMENT/ATTACK LOGIC ** //
  if ((xDifference === 1 && yDifference === 0) || (yDifference === 1 && xDifference === 0) || (yDifference === 1 && xDifference === 1)) {
    if (tileIsEmptyOrOccupiedByOpponent(newPosition, boardState, teamType)) {
      return true;
    }
  }

  return false;
}

export function getPossibleKingMoves(king, boardState) {
  const possibleMoves = [];


  return possibleMoves;
}
