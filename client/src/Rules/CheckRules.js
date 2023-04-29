// Utilities
import { sameColumn, sameDiagonal, samePosition, sameRow } from "utilities/Position";

// Rules
import { tileIsEmptyOrOccupiedByOpponent, getOpponentAttackMoves, getPieceAttackMoves, getStandardPieceMoves } from "Rules/GeneralRules";
import { checkIfPiecePinned } from "Rules/PinnedRules";
import { getKing } from "Rules/PieceRules/KingRules";

// Enums
import { PieceType } from "enums/PieceType";

// *********************** KING CHECK FUNCTIONS *********************** //
export const kingIsChecked = (teamType, boardState) => {
  const king = getKing(teamType, boardState);

  const attackedMoves = getOpponentAttackMoves(teamType, boardState);
  const isKingThreatened = attackedMoves.find((move) => {
    return samePosition(move, king.position)
  }
  );
  return isKingThreatened;
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
