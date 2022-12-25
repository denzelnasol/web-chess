// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from "enums/TeamType";

// Utilities
import { samePosition, getPositionPointDifference, sameColumn } from "utilities/Position";

// Rules
import { tileIsOccupied, tileIsOccupiedByOpponent } from "referee/Rules/GeneralRules";

// Objects
import Position from "objects/Position";

export function isEnPassantMove(grabPosition, newPosition, boardState, type, teamType) {
  const pawnDirection = teamType === TeamType.WHITE ? 1 : -1;
  const xDifference = getPositionPointDifference(newPosition.x, grabPosition.x);
  const yDifference = getPositionPointDifference(newPosition.y, grabPosition.y);

  if (type === PieceType.PAWN) {
    if ((xDifference === -1 || xDifference === 1) && yDifference === pawnDirection) {
      const piece = boardState.find((piece) =>
        samePosition(piece.position, new Position(newPosition.x, newPosition.y - pawnDirection)) && piece.enPassant
      );
      if (piece) return true;
    }
  }
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
