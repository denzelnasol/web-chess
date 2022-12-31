// Utilities
import { getPositionPointDifference, samePosition } from "utilities/Position";

// Rules
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent, getOpponentAttackMoves, getPieceAttackMoves } from "referee/Rules/GeneralRules";

// Models
import Position from "models/Position";

// Enums
import { TeamType } from "enums/TeamType";
import { PieceType } from "enums/PieceType";

export function isValidKingPosition(grabPosition, passedPosition, teamType, boardState, castleAvailable) {
  const kingRow = teamType === TeamType.WHITE ? 0 : 7;
  const xDifference = Math.abs(getPositionPointDifference(passedPosition.x, grabPosition.x));
  const yDifference = Math.abs(getPositionPointDifference(passedPosition.y, grabPosition.y));

  // ** MOVEMENT/ATTACK LOGIC ** //
  const kingAttackedMoves = getOpponentAttackMoves(teamType, boardState);
  const isPositionAttacked = kingAttackedMoves.find((move) =>
    samePosition(move, passedPosition)
  );
  if (isPositionAttacked) return false;

  if ((xDifference === 1 && yDifference === 0) || (yDifference === 1 && xDifference === 0) || (yDifference === 1 && xDifference === 1)) {
    if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, teamType)) {
      return true;
    }
  }


  const isKingInPosition = samePosition(grabPosition, new Position(3, kingRow));
  const isLeftKnightPositionEmpty = !tileIsOccupied(new Position(1, kingRow), boardState);
  const isLeftBishopPositionEmpty = !tileIsOccupied(new Position(2, kingRow), boardState);
  const isLeftNewPositionCorrect = samePosition(passedPosition, new Position(1, kingRow));

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
  const isRightNewPositionCorrect = samePosition(passedPosition, new Position(5, kingRow));

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
    const passedPosition = new Position(king.position.x, king.position.y + i);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, king.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  // Bottom movement
  for (let i = 1; i < 2; i++) {
    const passedPosition = new Position(king.position.x, king.position.y - i);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, king.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  // Left movement
  for (let i = 1; i < 2; i++) {
    const passedPosition = new Position(king.position.x - i, king.position.y);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, king.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  // Right movement
  for (let i = 1; i < 2; i++) {
    const passedPosition = new Position(king.position.x + i, king.position.y);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, king.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  // Upper right movement
  for (let i = 1; i < 2; i++) {
    const passedPosition = new Position(king.position.x + i, king.position.y + i);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, king.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  // Bottom right movement
  for (let i = 1; i < 2; i++) {
    const passedPosition = new Position(king.position.x + i, king.position.y - i);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, king.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  // Bottom left movement
  for (let i = 1; i < 2; i++) {
    const passedPosition = new Position(king.position.x - i, king.position.y - i);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, king.teamType)) {
      possibleMoves.push(passedPosition);
      break;
    } else {
      break;
    }
  }

  // Top left movement
  for (let i = 1; i < 2; i++) {
    const passedPosition = new Position(king.position.x - i, king.position.y + i);
    if (passedPosition.outOfBounds()) continue;

    if (!tileIsOccupied(passedPosition, boardState)) {
      possibleMoves.push(passedPosition);
    } else if (tileIsOccupiedByOpponent(passedPosition, boardState, king.teamType)) {
      possibleMoves.push(passedPosition);
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
      const passedPosition = new Position(1, kingRow);
      possibleMoves.push(passedPosition);
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
      const passedPosition = new Position(5, kingRow);
      possibleMoves.push(passedPosition);
    }
  }

  // Filter out positions being attacked
  const possibleAttackedMoves = getOpponentAttackMoves(king.teamType, boardState);
  possibleMoves = possibleMoves.filter((move) =>
    !possibleAttackedMoves.some((attackMove) => samePosition(move, attackMove))
  );

  return possibleMoves;
}

export const kingIsThreatened = (teamType, boardState) => {
  const king = getKing(teamType, boardState);

  const attackedMoves = getOpponentAttackMoves(teamType, boardState);
  const isKingThreatened = attackedMoves.find((move) => {
    return samePosition(move, king.position)
  }
  );
  return isKingThreatened;
}

export const kingIsSafe = (boardState, piece, passedPosition) => {
  if (piece.type === PieceType.KING) {
    // do stuff if king moves to safety
  }

  // do stuff if piece protects king

  return true;
}

export const getKing = (teamType, boardState) => {
  const king = boardState.find((piece) =>
    piece.type === PieceType.KING && piece.teamType === teamType
  );
  return king;
}

export const getPiecesAttackingKing = (teamType, boardState) => {
  const pieces = [];

  for (const piece of boardState) {
    if (teamType === piece.teamType) continue;

    const pieceAttackMoves = getPieceAttackMoves(piece, boardState);
    const king = getKing(teamType, boardState);
    const pieceAttackingKing = pieceAttackMoves.some((move) =>
      samePosition(king.position, move)
    );

    if (pieceAttackingKing) pieces.push(piece);
  }
  return pieces;
}
