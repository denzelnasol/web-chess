// Utilities
import { samePosition, sameColumn, sameRow } from "utilities/Position";

// Rules
import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent } from "referee/Rules/GeneralRules";

// Objects
import Position from "objects/Position";

export function isValidQueenPosition(grabPosition, newPosition, teamType, boardState) {
  const multiplierX = (newPosition.x < grabPosition.x) ? -1 : (newPosition.x > grabPosition.x) ? 1 : 0;
  const multiplierY = (newPosition.y < grabPosition.y) ? -1 : (newPosition.y > grabPosition.y) ? 1 : 0;

  // ** MOVEMENT/ATTACK LOGIC ** //
  for (let i = 1; i < 8; i++) {
    const passedPosition = new Position(grabPosition.x + (i * multiplierX), grabPosition.y + (i * multiplierY));

    if (samePosition(newPosition, passedPosition)) {
      if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, teamType)) {
        return true;
      }
    } else {
      if (tileIsOccupied(passedPosition, boardState)) {
        break;
      }
    }
  }

  return false;
}

export function getPossibleQueenMoves(queen, boardState) {
  const possibleMoves = [];


  return possibleMoves;
}
