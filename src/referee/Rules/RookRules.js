// Utilities
import { sameColumn, samePosition, sameRow } from "utilities/Position";

// Rules
import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent, tileIsOccupiedByOpponent, tileIsOccupiedByOpponentKing } from "referee/Rules/GeneralRules";

// Objects
import Position from "models/Position";

export function isValidRookPosition(grabPosition, newPosition, teamType, boardState) {
  // ** MOVEMENT/ATTACK LOGIC ** //
  for (let i = 1; i < 8; i++) {
    if (newPosition.x > grabPosition.x && sameRow(newPosition, grabPosition)) {
      const passedPosition = new Position(grabPosition.x + i, grabPosition.y);
      if (lastRookTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (newPosition.x < grabPosition.x && sameRow(newPosition, grabPosition)) {
      const passedPosition = new Position(grabPosition.x - i, grabPosition.y);
      if (lastRookTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (sameColumn(newPosition, grabPosition) && newPosition.y > grabPosition.y) {
      const passedPosition = new Position(grabPosition.x, grabPosition.y + i);
      if (lastRookTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    } else if (sameColumn(newPosition, grabPosition) && newPosition.y < grabPosition.y) {
      const passedPosition = new Position(grabPosition.x, grabPosition.y - i);
      if (lastRookTileIsValid(newPosition, passedPosition, boardState, teamType)) return true;
      if (tileIsOccupied(passedPosition, boardState)) break;
    }
  }

  return false;
}

function lastRookTileIsValid(newPosition, passedPosition, boardState, teamType) {
  if (samePosition(newPosition, passedPosition)) {
    if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, teamType)) {
      return true;
    }
  }

  return false;
}

export function getPossibleRookMoves(rook, boardState) {
  const possibleMoves = [];

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(rook.position.x, rook.position.y + i);

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(rook.position.x + i, rook.position.y);

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(rook.position.x, rook.position.y - i);

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(rook.position.x - i, rook.position.y);

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
}

export const getPossibleRookAttackMoves = (rook, boardState) => {
  const possibleMoves = [];

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(rook.position.x, rook.position.y + i);

    if (!tileIsOccupied(passedPosition, boardState) || tileIsOccupiedByOpponentKing(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(rook.position.x + i, rook.position.y);

    if (!tileIsOccupied(passedPosition, boardState) || tileIsOccupiedByOpponentKing(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(rook.position.x, rook.position.y - i);

    if (!tileIsOccupied(passedPosition, boardState) || tileIsOccupiedByOpponentKing(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  for (let i = 1; i < 8; i ++) {
    const passedPosition = new Position(rook.position.x - i, rook.position.y);

    if (!tileIsOccupied(passedPosition, boardState) || tileIsOccupiedByOpponentKing(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, rook.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
}