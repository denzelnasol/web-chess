// Utilities
import { samePosition, sameColumn, sameRow } from "utilities/Position";

// Rules
import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent } from "referee/Rules/GeneralRules";

// Objects
import Position from "objects/Position";

export function isValidQueenPosition(grabPosition, newPosition, teamType, boardState) {
  // ** MOVEMENT/ATTACK LOGIC ** //
  for (let i = 1; i < 8; i++) {
    if (newPosition.x > grabPosition.x && newPosition.y > grabPosition.y) {
      const passedPosition = new Position(grabPosition.x + i, grabPosition.y + i);
      if (lastQueenTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (newPosition.x > grabPosition.x && newPosition.y < grabPosition.y) {
      const passedPosition = new Position(grabPosition.x + i, grabPosition.y - i);
      if (lastQueenTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (newPosition.x < grabPosition.x && newPosition.y < grabPosition.y) {
      const passedPosition = new Position(grabPosition.x - i, grabPosition.y - i);
      if (lastQueenTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (newPosition.x < grabPosition.x && newPosition.y > grabPosition.y) {
      const passedPosition = new Position(grabPosition.x - i, grabPosition.y + i);
      if (lastQueenTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (newPosition.x > grabPosition.x && sameRow(newPosition, grabPosition)) {
      const passedPosition = new Position(grabPosition.x + i, grabPosition.y);
      if (lastQueenTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (newPosition.x < grabPosition.x && sameRow(newPosition, grabPosition)) {
      const passedPosition = new Position(grabPosition.x - i, grabPosition.y);
      if (lastQueenTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (sameColumn(newPosition, grabPosition) && newPosition.y > grabPosition.y) {
      const passedPosition = new Position(grabPosition.x, grabPosition.y + i);
      if (lastQueenTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (sameColumn(newPosition, grabPosition) && newPosition.y < grabPosition.y) {
      const passedPosition = new Position(grabPosition.x, grabPosition.y - i);
      if (lastQueenTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    }
  }

  return false;
}

function lastQueenTileIsValid(newPosition, passedPosition, boardState, teamType) {
  if (samePosition(newPosition, passedPosition)) {
    if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, teamType)) {
      return true;
    }
  }

  return false;
}
