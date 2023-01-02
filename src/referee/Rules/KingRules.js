// Utilities
import { getPositionPointDifference, sameColumn, sameDiagonal, samePosition, sameRow } from "utilities/Position";

// Rules
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent, getOpponentAttackMoves, getPieceAttackMoves, getStandardPieceMoves, checkIfPiecePinned } from "referee/Rules/GeneralRules";

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

export const kingIsChecked = (teamType, boardState) => {
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

export const getPieceCheckPath = (piece, teamType, boardState) => {
  let tiles = [];
  const king = getKing(teamType, boardState);

  switch (piece.type) {
    case PieceType.QUEEN:
      if (sameColumn(piece.position, king.position)) {
        tiles = getVerticalCheckTiles(piece, king);
      } else if (sameRow(piece.position, king.position)) {
        tiles = getHorizontalCheckTiles(piece, king);
      } else if (sameDiagonal(piece.position, king.position)) {
        tiles = getDiagonalCheckTiles(piece, king);
      }
      break;
    case PieceType.ROOK:
      if (sameColumn(piece.position, king.position)) {
        tiles = getVerticalCheckTiles(piece, king);
      } else if (sameRow(piece.position, king.position)) {
        tiles = getHorizontalCheckTiles(piece, king);
      }
      break;
    case PieceType.BISHOP:
      if (sameDiagonal(piece.position, king.position)) {
        tiles = getDiagonalCheckTiles(piece, king)
      }
      break;
    default:
      tiles.push(piece.position);

  }
  return tiles;
}

const getVerticalCheckTiles = (piece, king) => {
  let tiles = [];
  if (piece.abovePiece(king)) {
    tiles = piece.possibleMoves.filter((move) =>
      move.abovePosition(king.position) && move.belowPosition(piece.position) && sameColumn(move, king.position)
    );
  } else {
    tiles = piece.possibleMoves.filter((move) =>
      move.belowPosition(king.position) && move.abovePosition(piece.position) && sameColumn(move, king.position)
    );
  }
  tiles.push(piece.position);
  return tiles;
}

const getHorizontalCheckTiles = (piece, king) => {
  let tiles = [];
  if (piece.rightOfPiece(king)) {
    tiles = piece.possibleMoves.filter((move) =>
      move.rightOfPosition(king.position) && move.leftOfPosition(piece.position) && sameRow(move, king.position)
    );
  } else {
    tiles = piece.possibleMoves.filter((move) =>
      move.leftOfPosition(king.position) && move.rightOfPosition(piece.position) && sameRow(move, king.position)
    );
  }
  tiles.push(piece.position);
  return tiles;
}

const getDiagonalCheckTiles = (piece, king) => {
  let tiles = [];
  if (piece.abovePiece(king) && piece.leftOfPiece(king)) {
    tiles = piece.possibleMoves.filter((move) =>
      move.abovePosition(king.position) && move.belowPosition(piece.position) && sameDiagonal(move, king.position)
    );
  } else if (piece.belowPiece(king) && piece.leftOfPiece(king)) {
    tiles = piece.possibleMoves.filter((move) =>
      move.belowPosition(king.position) && move.abovePosition(piece.position) && sameDiagonal(move, king.position)
    );
  } else if (piece.abovePiece(king) && piece.rightOfPiece(king)) {
    tiles = piece.possibleMoves.filter((move) =>
      move.abovePosition(king.position) && move.belowPosition(piece.position) && sameDiagonal(move, king.position)
    );
  } else if (piece.belowPiece(king) && piece.rightOfPiece(king)) {
    tiles = piece.possibleMoves.filter((move) =>
      move.belowPosition(king.position) && move.abovePosition(piece.position) && sameDiagonal(move, king.position)
    );
  }
  tiles.push(piece.position);
  return tiles;
}

export const validKingCheckMove = (teamType, boardState, newPosition, possibleMoves) => {
  const piecesAttackingKing = getPiecesAttackingKing(teamType, boardState);
  for (const piece of piecesAttackingKing) {
    const pieceCheckPath = getPieceCheckPath(piece, teamType, boardState)
    let checkPathBlocked = false;
    for (const possiblePawnMove of possibleMoves) {
      checkPathBlocked = pieceCheckPath.find((move) =>
        samePosition(possiblePawnMove, move) && samePosition(possiblePawnMove, newPosition)
      );
      if (checkPathBlocked) break;
    }
    if (!checkPathBlocked) return false;
  }
  return true;
};

export const getKingCheckPieceMoves = (piece, boardState) => {
  const possibleMoves = [];
  const piecesAttackingKing = getPiecesAttackingKing(piece.teamType, boardState);
  const standardPieceMoves = getStandardPieceMoves(piece, boardState);

  const isPiecePinned = checkIfPiecePinned(piece, boardState);
  if (isPiecePinned) return possibleMoves;

  piecesAttackingKing.forEach((attackPiece) => {
    const pieceCheckPath = getPieceCheckPath(attackPiece, piece.teamType, boardState);
    standardPieceMoves.forEach((pieceMove) => {
      const isMovePossible = pieceCheckPath.find((move) =>
      samePosition(move, pieceMove) && tileIsEmptyOrOccupiedByOpponent(move, boardState, piece.teamType)
      );
      if (isMovePossible) possibleMoves.push(pieceMove);
    });
  });
  return possibleMoves;
};