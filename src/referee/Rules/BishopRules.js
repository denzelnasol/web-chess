// Utilities
import { samePosition } from "utilities/Position";

// Rules
import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent, tileIsOccupiedByOpponent, tileIsOccupiedByOpponentKing } from "referee/Rules/GeneralRules";

// Objects
import Position from "models/Position";

export function isValidBishopPosition(grabPosition, newPosition, teamType, boardState) {
  // ** MOVEMENT/ATTACK LOGIC ** //
  for (let i = 1; i < 8; i++) {
    if (newPosition.x > grabPosition.x && newPosition.y > grabPosition.y) {
      const passedPosition = new Position(grabPosition.x + i, grabPosition.y + i);
      if (lastBishopTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (newPosition.x > grabPosition.x && newPosition.y < grabPosition.y) {
      const passedPosition = new Position(grabPosition.x + i, grabPosition.y - i);
      if (lastBishopTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (newPosition.x < grabPosition.x && newPosition.y < grabPosition.y) {
      const passedPosition = new Position(grabPosition.x - i, grabPosition.y - i);
      if (lastBishopTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (newPosition.x < grabPosition.x && newPosition.y > grabPosition.y) {
      const passedPosition = new Position(grabPosition.x - i, grabPosition.y + i);
      if (lastBishopTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    }
  }

  return false;
}

function lastBishopTileIsValid(newPosition, passedPosition, boardState, teamType) {
  if (samePosition(newPosition, passedPosition)) {
    if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, teamType)) {
      return true;
    }
  }

  return false;
}

export function getPossibleBishopMoves(bishop, boardState) {
  const possibleMoves = [];

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(bishop.position.x + i, bishop.position.y + i);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(bishop.position.x + i, bishop.position.y - i);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(bishop.position.x - i, bishop.position.y - i);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(bishop.position.x - i, bishop.position.y + i);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
}

export function getPossibleBishopAttackMoves(bishop, boardState) {
  const possibleMoves = [];

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(bishop.position.x + i, bishop.position.y + i);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState) || tileIsOccupiedByOpponentKing(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(bishop.position.x + i, bishop.position.y - i);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState) || tileIsOccupiedByOpponentKing(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(bishop.position.x - i, bishop.position.y - i);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState) || tileIsOccupiedByOpponentKing(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(bishop.position.x - i, bishop.position.y + i);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState) || tileIsOccupiedByOpponentKing(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, bishop.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
}
