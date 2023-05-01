// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from "enums/TeamType";

// Utilities
import { samePosition } from "utilities/Position";

// Rules
import { getPieceFromPosition, tileIsOccupied, tileIsOccupiedByOpponent } from "Rules/GeneralRules";
import { kingIsChecked, getPieceCheckPath, getPiecesAttackingKing } from "Rules/CheckRules";
import { checkPinnedPiecePotentialMove, checkIfPiecePinned } from "Rules/PinnedRules";

// Objects
import Position from "models/Position";

const moveIsPawnPromotion = (newPosition, type, teamType) => {
  const promotionRow = teamType === TeamType.WHITE ? 7 : 0;
  return type === PieceType.PAWN && newPosition.y === promotionRow;
};

const isValidPawnPosition = (grabPosition, newPosition, teamType, board) => {
  if (teamType !== board.currentPlayer.teamType) return false;
  const pawn = getPieceFromPosition(grabPosition, board.pieces);
  return pawn.possibleMoves.find((move) => samePosition(move, newPosition));
};

const getPossiblePawnMoves = (pawn, boardState) => {
  // ** PAWN PINNED LOGIC ** //
  const isPawnPinned = checkIfPiecePinned(pawn, boardState);
  if (isPawnPinned) return getPinnedPawnMoves(pawn, boardState);

  // ** KING CHECK LOGIC ** //
  const isKingCheck = kingIsChecked(pawn.teamType, boardState);
  if (isKingCheck) return getKingCheckPawnMoves(pawn, boardState);

  // ** STANDARD MOVE LOGIC ** //
  return getStandardPawnMoves(pawn, boardState);
};

const getPossiblePawnAttackMoves = (pawn) => {
  const pawnDirection = (pawn.teamType === TeamType.WHITE ? 1 : -1);
  const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);
  return [upperLeftAttack, upperRightAttack];
}

// *********************** KING CHECK PAWN MOVE FUNCTIONS *********************** //
const getKingCheckPawnMoves = (pawn, boardState) => {
  const possibleMoves = [];
  const piecesAttackingKing = getPiecesAttackingKing(pawn.teamType, boardState);
  const pawnDirection = (pawn.teamType === TeamType.WHITE ? 1 : -1);
  const initialPawnRow = (pawn.teamType === TeamType.WHITE ? 1 : 6);
  
  const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection);
  const specialMove = new Position(normalMove.x, normalMove.y + pawnDirection);
  const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);
  
  piecesAttackingKing.forEach((piece) => {
    const pieceCheckPath = getPieceCheckPath(piece, pawn.teamType, boardState);

    if (pieceCheckPath.some((move) => samePosition(move, specialMove) && !tileIsOccupied(move, boardState) && !tileIsOccupied(normalMove, boardState) && pawn.position.y === initialPawnRow)) {
      possibleMoves.push(specialMove);
    }

    if (pieceCheckPath.some((move) => samePosition(move, normalMove) && !tileIsOccupied(move, boardState))) {
      possibleMoves.push(normalMove);
    }

    if (pieceCheckPath.some((move) => samePosition(move, upperLeftAttack) && tileIsOccupiedByOpponent(move, boardState, pawn.teamType))) {
      possibleMoves.push(upperLeftAttack);
    }

    if (pieceCheckPath.some((move) => samePosition(move, upperRightAttack) && tileIsOccupiedByOpponent(move, boardState, pawn.teamType))) {
      possibleMoves.push(upperRightAttack);
    }
  });

  return possibleMoves;
};

// *********************** PINNED PAWN MOVE FUNCTIONS *********************** //
const getPinnedPawnMoves = (pawn, boardState) => {
  const possibleMoves = [];
  const initialPawnRow = (pawn.teamType === TeamType.WHITE ? 1 : 6);
  const pawnDirection = (pawn.teamType === TeamType.WHITE ? 1 : -1);

  const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection);
  const specialMove = new Position(normalMove.x, normalMove.y + pawnDirection);
  const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);

  const checkPotentialMove = (move) => {
    return checkPinnedPiecePotentialMove(move, pawn, boardState);
  }

  if (!tileIsOccupied(normalMove, boardState) && checkPotentialMove(normalMove)) {
    possibleMoves.push(normalMove);
    if (!tileIsOccupied(specialMove, boardState) && pawn.position.y === initialPawnRow && checkPotentialMove(specialMove)) {
      possibleMoves.push(specialMove);
    }
  } else if (tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.teamType) && checkPotentialMove(upperLeftAttack)) {
    possibleMoves.push(upperLeftAttack);
  } else if (tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.teamType) && checkPotentialMove(upperRightAttack)) {
    possibleMoves.push(upperRightAttack);
  }

  return possibleMoves;
};

// *********************** STANDARD PAWN MOVE FUNCTIONS *********************** //
const getStandardPawnMoves = (pawn, boardState) => {
  const possibleMoves = [];

  const initialPawnRow = (pawn.teamType === TeamType.WHITE ? 1 : 6);
  const pawnDirection = (pawn.teamType === TeamType.WHITE ? 1 : -1);

  const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection);
  const specialMove = new Position(normalMove.x, normalMove.y + pawnDirection);
  const leftMove = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const rightMove = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);

  if (!tileIsOccupied(normalMove, boardState)) {
    possibleMoves.push(normalMove);
    if (pawn.position.y === initialPawnRow && !tileIsOccupied(specialMove, boardState)) {
      possibleMoves.push(specialMove);
    }
  }

  [leftMove, rightMove].forEach((diagonal) => {
    const piece = boardState.find(p => samePosition(p.position, diagonal) && p.teamType !== pawn.teamType);
    if (piece != null && piece.enPassant) {
      possibleMoves.push(diagonal);
    } else if (tileIsOccupiedByOpponent(diagonal, boardState, pawn.teamType)) {
      possibleMoves.push(diagonal);
    }
  });

  return possibleMoves;
};

export {
  moveIsPawnPromotion,
  isValidPawnPosition,
  getPossiblePawnMoves,
  getPossiblePawnAttackMoves
};