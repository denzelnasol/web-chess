// Utilities
import { getPositionPointDifference, sameColumn, sameDiagonal, samePosition, sameRow } from "utilities/Position";

// Rules
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent, getOpponentAttackMoves, getPieceAttackMoves, getStandardPieceMoves, checkIfPiecePinned } from "PieceRules/GeneralRules";

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
  const possibleAttackedMoves = getOpponentAttackMoves(teamType, boardState);
  const isKingChecked = kingIsChecked(teamType, boardState);

  // Left Castle
  const leftKnightPosition = new Position(1, kingRow);
  const leftBishopPosition = new Position(2, kingRow);
  const isLeftKnightPositionEmpty = !tileIsOccupied(leftKnightPosition, boardState);
  const isLeftBishopPositionEmpty = !tileIsOccupied(leftBishopPosition, boardState);
  const isLeftNewPositionCorrect = samePosition(passedPosition, leftKnightPosition);
  
  const isLeftKnightPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, leftKnightPosition)
    );
    
    const isLeftBishopPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, leftBishopPosition)
    );
    
  if (isKingInPosition && isLeftKnightPositionEmpty && isLeftBishopPositionEmpty && isLeftNewPositionCorrect && castleAvailable && !isLeftKnightPositionAttacked && !isLeftBishopPositionAttacked && !isKingChecked) {
    const rook = boardState.find((piece) =>
      samePosition(new Position(0, kingRow), piece.position) && piece.castleAvailable
    );
    if (rook) return true;
  }

  
  // Right Castle
  const rightKnightPosition = new Position(6, kingRow);
  const rightBishopPosition = new Position(5, kingRow);
  const queenPosition = new Position(4, kingRow);
  
  const isRightKnightPositionEmpty = !tileIsOccupied(rightKnightPosition, boardState);
  const isRightBishopPositionEmpty = !tileIsOccupied(rightBishopPosition, boardState);
  const isQueenPositionEmpty = !tileIsOccupied(queenPosition, boardState);
  const isRightNewPositionCorrect = samePosition(passedPosition, rightBishopPosition);
  
  const isRightKnightPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, rightKnightPosition)
  );

  const isRightBishopPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, rightBishopPosition)
  );

  const isQueenPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, queenPosition)
  );

  if (isKingInPosition && isRightKnightPositionEmpty && isRightBishopPositionEmpty && isQueenPositionEmpty && isRightNewPositionCorrect && castleAvailable && !isRightBishopPositionAttacked && !isRightKnightPositionAttacked && !isQueenPositionAttacked && !isKingChecked) {
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

  const possibleAttackedMoves = getOpponentAttackMoves(king.teamType, boardState);
  const isKingChecked = kingIsChecked(king.teamType, boardState);

  // Left Castle
  const leftKnightPosition = new Position(1, kingRow);
  const leftBishopPosition = new Position(2, kingRow);
  const isLeftKnightPositionEmpty = !tileIsOccupied(leftKnightPosition, boardState);
  const isLeftBishopPositionEmpty = !tileIsOccupied(leftBishopPosition, boardState);

  const isLeftKnightPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, leftKnightPosition)
  );

  const isLeftBishopPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, leftBishopPosition)
  );

  if (isLeftKnightPositionEmpty && isLeftBishopPositionEmpty && king.castleAvailable && !isLeftKnightPositionAttacked && !isLeftBishopPositionAttacked && !isKingChecked) {
    const rook = boardState.find((piece) =>
      samePosition(new Position(0, kingRow), piece.position) && piece.castleAvailable
    );

    if (rook) {
      const passedPosition = new Position(1, kingRow);
      possibleMoves.push(passedPosition);
    }
  }


  // Right Castle
  const rightKnightPosition = new Position(6, kingRow);
  const rightBishopPosition = new Position(5, kingRow);
  const queenPosition = new Position(4, kingRow);

  const isRightKnightPositionEmpty = !tileIsOccupied(rightKnightPosition, boardState);
  const isRightBishopPositionEmpty = !tileIsOccupied(rightBishopPosition, boardState);
  const isQueenPositionEmpty = !tileIsOccupied(queenPosition, boardState);

  const isRightKnightPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, rightKnightPosition)
  );

  const isRightBishopPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, rightBishopPosition)
  );

  const isQueenPositionAttacked = possibleAttackedMoves.find((move) =>
    samePosition(move, queenPosition)
  );

  if (isRightKnightPositionEmpty && isRightBishopPositionEmpty && isQueenPositionEmpty && king.castleAvailable && !isRightKnightPositionAttacked && !isRightBishopPositionAttacked && !isQueenPositionAttacked && !isKingChecked) {
    const rook = boardState.find((piece) =>
      samePosition(new Position(7, kingRow), piece.position) && piece.castleAvailable
    );

    if (rook) {
      const passedPosition = new Position(5, kingRow);
      possibleMoves.push(passedPosition);
    }
  }

  // Filter out positions being attacked
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
