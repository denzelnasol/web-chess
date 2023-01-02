// Utilities
import { getPositionPointDifference } from "utilities/Position";

// Rules
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupiedByAlly } from "referee/Rules/GeneralRules";

// Models
import Position from "models/Position";

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
  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      const verticalMove = new Position(knight.position.x + j, knight.position.y + i * 2);
      const horizontalMove = new Position(knight.position.x + i * 2, knight.position.y + j);

      if(tileIsEmptyOrOccupiedByOpponent(verticalMove, boardState, knight.teamType)) {
        // if (verticalMove.outOfBounds()) continue;
        possibleMoves.push(verticalMove);
      }

      if(tileIsEmptyOrOccupiedByOpponent(horizontalMove, boardState, knight.teamType)) {
        // if (horizontalMove.outOfBounds()) continue;
        possibleMoves.push(horizontalMove);
      }
    }
  }
  return possibleMoves;
}

export const getPossibleKnightAttackMoves = (knight, boardState) => {
  const possibleMoves = [];

  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      const verticalMove = new Position(knight.position.x + j, knight.position.y + i * 2);
      const horizontalMove = new Position(knight.position.x + i * 2, knight.position.y + j);

      if(tileIsEmptyOrOccupiedByOpponent(verticalMove, boardState, knight.teamType) || tileIsOccupiedByAlly(verticalMove, boardState, knight.teamType)) {
        // if (verticalMove.outOfBounds()) continue;
        possibleMoves.push(verticalMove);
      }

      if(tileIsEmptyOrOccupiedByOpponent(horizontalMove, boardState, knight.teamType) || tileIsOccupiedByAlly(horizontalMove, boardState, knight.teamType)) {
        // if (horizontalMove.outOfBounds()) continue;
        possibleMoves.push(horizontalMove);
      }
    }
  }

  return possibleMoves;
};
