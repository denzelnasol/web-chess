// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from 'enums/TeamType';

// Models
import Position from 'models/Position';
import Piece from "models/Piece";

// Utilities
import { samePosition } from "utilities/Position";
import { getOppositeTeamType } from "utilities/TeamType";

// Rules
import { getPossiblePawnMoves } from "referee/Rules/PawnRules";
import { getPossibleKnightMoves } from "referee/Rules/KnightRules";
import { getPossibleBishopMoves } from "referee/Rules/BishopRules";
import { getPossibleRookMoves } from "referee/Rules/RookRules";
import { getPossibleQueenMoves } from "referee/Rules/QueenRules";
import { getPossibleKingMoves, kingIsChecked, kingIsSafe, getKing } from "referee/Rules/KingRules";

export default class Board {
  constructor(pieces) {
    this.pieces = pieces;
  }

  calculateAllMoves(currentPlayer) {
    for (const piece of this.pieces) {
      if (piece.type === PieceType.KING) continue;
      piece.possibleMoves = this.getPossibleMoves(piece, this.pieces, currentPlayer);
    }

    for (const piece of this.pieces) {
      if (piece.type !== PieceType.KING) continue;
      piece.possibleMoves = this.getPossibleMoves(piece, this.pieces, currentPlayer);
    }
  }

  getPossibleMoves(piece, boardState, currentPlayer) {
    let possibleMoves = [];

    /** @TODO Why does this work? */
    if (currentPlayer && piece && currentPlayer.teamType === piece.teamType) {
      return possibleMoves;
    }

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
        break;
    }

    return possibleMoves;
  }

  playMove(isEnpassantMove, isValidMove, isPawnPromotionMove, isCastleMove, isKingThreatened, isPlayerValid, piece, newPosition, updatePromotionPawn, currentPlayer) {
    const pawnDirection = piece.teamType === TeamType.WHITE ? 1 : -1;
    const kingRow = piece.teamType === TeamType.WHITE ? 0 : 7;
    const king = getKing(piece.teamType, this.pieces);

    if (!isPlayerValid) return false;

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

      this.calculateAllMoves(currentPlayer);
    } else if (isValidMove) {
      this.pieces = this.pieces.reduce((results, currentPiece) => {

        // Set king to no longer in check if move is valid
        if (isKingThreatened && samePosition(currentPiece.position, king.position)) {
          currentPiece.inCheck = false;
        }

        // Check if given piece is the same
        if (samePosition(currentPiece.position, piece.position)) {
          // Check if enpassant move
          if (currentPiece.type === PieceType.PAWN) {
            currentPiece.enPassant = Math.abs(piece.position.y - newPosition.y) === 2 && currentPiece.type === PieceType.PAWN;
          }

          // Check if castle move
          if (isCastleMove && piece.castleAvailable) {
            // Left Castle
            if (samePosition(newPosition, new Position(1, kingRow))) {
              const rook = this.pieces.find((piece) =>
                samePosition(piece.position, new Position(0, kingRow))
              );

              if (rook) {
                rook.position = new Position(2, kingRow);
                rook.castleAvailable = false;
              }
            }

            // Right Castle
            if (samePosition(newPosition, new Position(5, kingRow))) {
              const rook = this.pieces.find((piece) =>
                samePosition(piece.position, new Position(7, kingRow))
              );

              if (rook) {
                rook.position = new Position(4, kingRow);
                rook.castleAvailable = false;
              }
            }
          }

          // Update piece position
          currentPiece.position.x = newPosition.x;
          currentPiece.position.y = newPosition.y;
          currentPiece.castleAvailable = false;

          // Update promotion pawn
          if (isPawnPromotionMove) {
            updatePromotionPawn(currentPiece);
          }

          results.push(currentPiece);
        } else if (!samePosition(currentPiece.position, newPosition)) {
          if (currentPiece.type === PieceType.PAWN) {
            currentPiece.enPassant = false;
          }
          results.push(currentPiece);
        }

        return results;
      }, []);

      this.calculateAllMoves(currentPlayer);
      this.opponentKingInCheck(piece.teamType, currentPlayer);
    } else {
      return false;
    }

    return true;
  }

  opponentKingInCheck(teamType, currentPlayer) {
    const oppositeTeamType = getOppositeTeamType(teamType);
    const isOpponentKingThreatened = kingIsChecked(oppositeTeamType, this.pieces);
    if (!isOpponentKingThreatened) return;

    const king = getKing(oppositeTeamType, this.pieces);
    this.pieces = this.pieces.reduce((results, currentPiece) => {
      if (samePosition(king.position, currentPiece.position)) {
        currentPiece.inCheck = true;
        results.push(currentPiece);
      } else {
        results.push(currentPiece);
      }

      return results;
    }, []);

    this.calculateAllMoves(currentPlayer);
  }

  promotePawn(pieceType, promotionPawn, currentPlayer) {
    this.pieces = this.pieces.reduce((results, currentPiece) => {
      if (samePosition(currentPiece.position, promotionPawn.position)) {
        const teamType = (currentPiece.teamType === TeamType.WHITE) ? TeamType.WHITE.toLowerCase() : TeamType.BLACK.toLowerCase();
        currentPiece = new Piece(currentPiece.position, pieceType, teamType);
      }

      results.push(currentPiece);
      return results;
    }, []);

    this.calculateAllMoves(currentPlayer);
  }

  clone() {
    return new Board(this.pieces.map((piece) => piece.clone()));
  }
}
