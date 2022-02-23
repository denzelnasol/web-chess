import { TeamType } from "enums/TeamType";
import { PieceType } from "enums/PieceType";
import Piece from 'objects/Piece';

export default class Referee {

  isTileOccupied(x, y, boardState) {
    const piece = boardState.find((p) => p.x === x && p.y === y);

    if (piece) return true;
    return false;
  }

  isTileOccupiedByOpponent(x, y, boardState, teamType) {
    const piece = boardState.find((p) => p.x === x && p.y === y && p.teamType !== teamType);
    console.log('piece: ', piece);
    if (piece) return true;
    return false;
  }

  isValidPawnPosition(previousX, previousY, currentX, currentY, teamType, boardState) {

    // 1 if White, 6 if Black
    const initialPawnRow = (teamType === TeamType.WHITE ? 1 : 6)

    // 1 if White, -1 if Black
    const pawnDirection = (teamType === TeamType.WHITE ? 1 : -1);

    // Previous X coordinate is the same as the current X coordinate
    const isSameColumn = (previousX === currentX);

    // Value difference of current and previous Y coordinates
    const xDifference = currentX - previousX;
    
    // Value difference of current and previous Y coordinates
    const yDifference = currentY - previousY;
    
    // ** MOVEMENT LOGIC ** //

    // check if pawn is at initial position, no piece blocks it moving forward, and may move two spaces forward
    if (isSameColumn && previousY === initialPawnRow && yDifference === 2 * pawnDirection) {
      const tileOccupied = this.isTileOccupied(currentX, currentY - pawnDirection, boardState);
      if (!tileOccupied) return true
    }

    // check if pawn may move one space forward
    if (isSameColumn && yDifference === pawnDirection) return true;

    // ** ATTACK LOGIC ** //

    if ((xDifference === -1 || xDifference === 1) && yDifference === pawnDirection) {
      const isTileOccupied = this.isTileOccupiedByOpponent(currentX, currentY, boardState, teamType);
      if (isTileOccupied) {
        return true;
      }
    }

    return false;
  }

  isValidMove(previousX, previousY, currentX, currentY, type, teamType, boardState) {
    console.log('this ran')
    if (this.isTileOccupied(currentX, currentY, boardState) && !this.isTileOccupiedByOpponent(currentX, currentY, boardState, teamType)) return false;

    if (type === PieceType.PAWN && this.isValidPawnPosition(previousX, previousY, currentX, currentY, teamType, boardState)) return true;

    return false;
  }
}