// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from 'enums/TeamType';

// Models
import Position from 'models/Position';

// Utilities
import { samePosition } from "utilities/Position";

// Rules
import { getPossiblePawnMoves } from "referee/Rules/PawnRules";
import { getPossibleKnightMoves } from "referee/Rules/KnightRules";
import { getPossibleBishopMoves } from "referee/Rules/BishopRules";
import { getPossibleRookMoves } from "referee/Rules/RookRules";
import { getPossibleQueenMoves } from "referee/Rules/QueenRules";
import { getPossibleKingMoves } from "referee/Rules/KingRules";

export default class Board {
  constructor(pieces) {
    this.pieces = pieces;
  }

  calculateAllMoves() {
    for (const piece of this.pieces) {
      piece.possibleMoves = this.getPossibleMoves(piece, this.pieces)
    }
  }

  getPossibleMoves(piece, boardState) {
    let possibleMoves = [];

    switch (piece.type) {
      case PieceType.PAWN:
        possibleMoves = getPossiblePawnMoves(piece, boardState);
        break;
      case PieceType.KNIGHT:
        possibleMoves = getPossibleKnightMoves(piece, boardState);
        break;
      case PieceType.BISHOP:
        possibleMoves = getPossibleBishopMoves(piece, boardState);
        break;
      case PieceType.ROOK:
        possibleMoves = getPossibleRookMoves(piece, boardState);
        break;
      case PieceType.QUEEN:
        possibleMoves = getPossibleQueenMoves(piece, boardState);
        break;
      case PieceType.KING:
        possibleMoves = getPossibleKingMoves(piece, boardState);
    }

    return possibleMoves;
  }

  playMove(isEnpassantMove, isValidMove, piece, newPosition) {
    const pawnDirection = piece.team === TeamType.OUR ? 1 : -1;

    if (isEnpassantMove) {
      this.pieces = this.pieces.reduce((results, currentPiece) => {
        if (samePosition(piece.position, currentPiece.position)) {
          if (currentPiece.isPawn)
            currentPiece.enPassant = false;
          currentPiece.position.x = newPosition.x;
          currentPiece.position.y = newPosition.y;
          results.push(currentPiece);
        } else if (!samePosition(currentPiece.position, new Position(newPosition.x, newPosition.y - pawnDirection))) {
          if (currentPiece.type === PieceType.PAWN) {
            currentPiece.enPassant = false;
          }
          results.push(currentPiece);
        }

        return results;
      }, []);

      this.calculateAllMoves();
    } else if (isValidMove) {
      //UPDATES THE PIECE POSITION
      //AND IF A PIECE IS ATTACKED, REMOVES IT
      this.pieces = this.pieces.reduce((results, currentPiece) => {
        if (samePosition(currentPiece.position, piece.position)) {
          // SPECIAL MOVE
          if (currentPiece.type === PieceType.PAWN) {
            currentPiece.enPassant = Math.abs(piece.position.y - newPosition.y) === 2 && currentPiece.type === PieceType.PAWN;
            console.log(currentPiece.enPassant)
          }
            currentPiece.position.x = newPosition.x;
            currentPiece.position.y = newPosition.y;
            results.push(currentPiece);
        } else if (!samePosition(currentPiece.position, newPosition)) {
          if (currentPiece.type === PieceType.PAWN) {
            currentPiece.enPassant = false;
          }
          results.push(currentPiece);
        }

        return results;
      }, []);

      this.calculateAllMoves();
    } else {
      return false;
    }

    return true;
  }

  clone() {
    return new Board(this.pieces.map((piece) => piece.clone()));
  }
}