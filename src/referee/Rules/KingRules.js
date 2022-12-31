// Utilities
import { getPositionPointDifference, samePosition } from "utilities/Position";

// Rules
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "referee/Rules/GeneralRules";
import { getPossiblePawnAttackMoves } from "referee/Rules/PawnRules";

// Models
import Position from "models/Position";

// Enums
import { TeamType } from "enums/TeamType";
import { PieceType } from "enums/PieceType";

export function isValidKingPosition(grabPosition, newPosition, teamType, boardState, castleAvailable) {
  const kingRow = teamType === TeamType.WHITE ? 0 : 7;
  const xDifference = Math.abs(getPositionPointDifference(newPosition.x, grabPosition.x));
  const yDifference = Math.abs(getPositionPointDifference(newPosition.y, grabPosition.y));

  // ** MOVEMENT/ATTACK LOGIC ** //
  const kingAttackedMoves = getKingAttackedMoves(teamType, boardState);
  const isPositionAttacked = kingAttackedMoves.find((move) => 
    samePosition(move, newPosition)
  );
  if (isPositionAttacked) return false;

  if ((xDifference === 1 && yDifference === 0) || (yDifference === 1 && xDifference === 0) || (yDifference === 1 && xDifference === 1)) {
    if (tileIsEmptyOrOccupiedByOpponent(newPosition, boardState, teamType)) {
      return true;
    }
  }


  const isKingInPosition = samePosition(grabPosition, new Position(3, kingRow));
  const isLeftKnightPositionEmpty = !tileIsOccupied(new Position(1, kingRow), boardState);
  const isLeftBishopPositionEmpty = !tileIsOccupied(new Position(2, kingRow), boardState);
  const isLeftNewPositionCorrect = samePosition(newPosition, new Position(1, kingRow));

  // Left Castle
  if (isKingInPosition && isLeftKnightPositionEmpty && isLeftBishopPositionEmpty && isLeftNewPositionCorrect && castleAvailable) {
    const rook = boardState.find((piece) =>
      samePosition(new Position(0, kingRow), piece.position) && piece.castleAvailable
    );
    if (rook) return true;
  }

  const isRightKnightPositionEmpty = !tileIsOccupied(new Position(6, kingRow), boardState);
  const isRightBishopPositionEmpty = !tileIsOccupied(new Position(5, kingRow), boardState);
  const isQueenPositionEmpty = !tileIsOccupied(new Position(4, kingRow), boardState);
  const isRightNewPositionCorrect = samePosition(newPosition, new Position(5, kingRow));

  // Right Castle
  if (isKingInPosition && isRightKnightPositionEmpty && isRightBishopPositionEmpty && isQueenPositionEmpty && isRightNewPositionCorrect && castleAvailable) {
    const rook = boardState.find((piece) =>
      samePosition(new Position(7, kingRow), piece.position) && piece.castleAvailable
    );
    if (rook) return true;
  }

  return false;
}

export function getPossibleKingMoves(king, boardState) {
  let possibleMoves = [];
  const kingRow = king.teamType === TeamType.WHITE ? 0 : 7;

  // Top movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x, king.position.y + i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.teamType)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // Bottom movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x, king.position.y - i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.teamType)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // Left movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x - i, king.position.y);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.teamType)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // Right movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x + i, king.position.y);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.teamType)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // Upper right movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x + i, king.position.y + i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.teamType)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // Bottom right movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x + i, king.position.y - i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.teamType)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // Bottom left movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x - i, king.position.y - i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.teamType)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // Top left movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x - i, king.position.y + i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.teamType)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  const isLeftKnightPositionEmpty = !tileIsOccupied(new Position(1, kingRow), boardState);
  const isLeftBishopPositionEmpty = !tileIsOccupied(new Position(2, kingRow), boardState);

  // Left Castle
  if (isLeftKnightPositionEmpty && isLeftBishopPositionEmpty && king.castleAvailable) {
    const rook = boardState.find((piece) =>
      samePosition(new Position(0, kingRow), piece.position) && piece.castleAvailable
    );

    if (rook) {
      const destination = new Position(1, kingRow);
      possibleMoves.push(destination);
    }
  }

  const isRightKnightPositionEmpty = !tileIsOccupied(new Position(6, kingRow), boardState);
  const isRightBishopPositionEmpty = !tileIsOccupied(new Position(5, kingRow), boardState);
  const isQueenPositionEmpty = !tileIsOccupied(new Position(4, kingRow), boardState);

  // Right Castle
  if (isRightKnightPositionEmpty && isRightBishopPositionEmpty && isQueenPositionEmpty && king.castleAvailable) {
    const rook = boardState.find((piece) =>
      samePosition(new Position(7, kingRow), piece.position) && piece.castleAvailable
    );

    if (rook) {
      const destination = new Position(5, kingRow);
      possibleMoves.push(destination);
    }
  }

  // Filter out positions being attacked
  const possibleAttackedMoves = getKingAttackedMoves(king.teamType, boardState);
  possibleMoves = possibleMoves.filter((move) =>
    !possibleAttackedMoves.some((attackMove) => samePosition(move, attackMove))
  );

  return possibleMoves;
}

function getKingAttackedMoves(teamType, boardState) {
  const possibleAttackMoves = [];
  for (const piece of boardState) {
    if (piece.teamType !== teamType) {
      let attackMoves = [];
      if (piece.type === PieceType.PAWN) attackMoves = getPossiblePawnAttackMoves(piece);
      else attackMoves = piece.possibleMoves;

      for (const move of attackMoves) possibleAttackMoves.push(move);
    }
  }

  return possibleAttackMoves;
}

export const kingIsThreatened = (teamType, boardState) => {
  const king = boardState.find((piece) =>
    piece.type === PieceType.KING && piece.teamType === teamType
  );

  const attackedMoves = getKingAttackedMoves(teamType, boardState);
  const isKingAttacked = attackedMoves.find((move) => {
    return samePosition(move, king.position)
  }
  );
  return isKingAttacked;
}
