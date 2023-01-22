// Utilities
import { samePosition } from "utilities/Position";

// Rules
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupiedByAlly, getPieceFromPosition } from "Rules/GeneralRules";
import { kingIsChecked, getKingCheckPieceMoves } from "Rules/PieceRules/KingRules";
import { checkIfPiecePinned, getPinnedPieceMoves } from "Rules/PinnedRules";

// Models
import Position from "models/Position";

export function isValidKnightPosition(grabPosition, newPosition, teamType, board) {
  if (teamType !== board.currentPlayer.teamType) return false;
  const knight = getPieceFromPosition(grabPosition, board.pieces);
  const isValidMove = knight.possibleMoves.find((move) => samePosition(move, newPosition));
  return isValidMove;
}

export function getPossibleKnightMoves(knight, boardState) {
  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(knight.teamType, boardState);
  if (isKingCheck) return getKingCheckPieceMoves(knight, boardState);

  // ** KNIGHT PINNED LOGIC ** //
  const isKnightPinned = checkIfPiecePinned(knight, boardState);
  if (isKnightPinned) return getPinnedPieceMoves(knight, boardState);

  // ** STANDARD MOVE LOGIC ** //
  return getStandardKnightMoves(knight, boardState);
}

export const getPossibleKnightAttackMoves = (knight, boardState) => {
  const possibleMoves = [];

  const knightMoves = [ [1, 2], [1, -2], [2, 1], [2, -1], [-2, -1], [-1, -2], [-1, 2], [-2, 1]];

  knightMoves.forEach((move) => {
    const newPos = new Position(knight.position.x + move[0], knight.position.y + move[1]);
    if (newPos.outOfBounds()) return;
    if (tileIsEmptyOrOccupiedByOpponent(newPos, boardState, knight.teamType)  || tileIsOccupiedByAlly(newPos, boardState, knight.teamType)) possibleMoves.push(newPos);
  })
  return possibleMoves;
};

// *********************** STANDARD KNIGHT MOVE FUNCTIONS *********************** //
export const getStandardKnightMoves = (knight, boardState) => {
  const possibleMoves = [];
  const knightMoves = [ [1, 2], [1, -2], [2, 1], [2, -1], [-2, -1], [-1, -2], [-1, 2], [-2, 1]];

  knightMoves.forEach((move) => {
    const newPos = new Position(knight.position.x + move[0], knight.position.y + move[1]);
    if (newPos.outOfBounds()) return;
    if (tileIsEmptyOrOccupiedByOpponent(newPos, boardState, knight.teamType)) possibleMoves.push(newPos);
  })
  return possibleMoves;
};
