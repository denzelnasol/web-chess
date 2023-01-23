// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from 'enums/TeamType';

// Models
import Position from 'models/Position';
import Piece from "models/Pieces/Piece";

// Utilities
import { samePosition } from "utilities/Position";
import { getOppositeTeamType } from "utilities/TeamType";

// Rules
import { getPossiblePawnMoves } from "Rules/PieceRules/PawnRules";
import { getPossibleKnightMoves } from "Rules/PieceRules/KnightRules";
import { getPossibleBishopMoves } from "Rules/PieceRules/BishopRules";
import { getPossibleRookMoves } from "Rules/PieceRules/RookRules";
import { getPossibleQueenMoves } from "Rules/PieceRules/QueenRules";
import { getPossibleKingMoves, getKing } from "Rules/PieceRules/KingRules";
import { kingIsChecked } from "Rules/CheckRules";

// Constants
import { PLAYERS } from "constants/Constants";

export default class Board {
  constructor(pieces, currentPlayer) {
    this.pieces = pieces;
    this.currentPlayer = currentPlayer
  }

  calculateAllMoves(playerTeamType) {
    for (const piece of this.pieces) {
      if (piece.type === PieceType.KING) continue;
      if (playerTeamType !== piece.teamType) piece.isImmovable = true;
      else piece.isImmovable = false;
      piece.possibleMoves = this.getPossibleMoves(piece, this.pieces);
    }

    for (const piece of this.pieces) {
      if (piece.type !== PieceType.KING) continue;
      if (playerTeamType !== piece.teamType) piece.isImmovable = true;
      else piece.isImmovable = false;
      piece.possibleMoves = this.getPossibleMoves(piece, this.pieces);
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
        break;
    }

    return possibleMoves;
  }

  getAllPlayerPossiblePieceMoves(teamType) {
    const allPlayerPossiblePieceMoves = [];
    this.pieces.forEach((piece) => {
      if (piece.teamType !== teamType) return;
      const possibleMoves = this.getPossibleMoves(piece, this.pieces);
      possibleMoves.forEach((move) => {
        allPlayerPossiblePieceMoves.push({ piece, move });
      })
    })

    return allPlayerPossiblePieceMoves;
  }

  playMove(isEnpassantMove, isValidMove, isPawnPromotionMove, isCastleMove, isKingThreatened, piece, newPosition, updatePromotionPawn) {
    const pawnDirection = piece.teamType === TeamType.WHITE ? 1 : -1;
    const kingRow = piece.teamType === TeamType.WHITE ? 0 : 7;
    const king = getKing(piece.teamType, this.pieces);
    const otherPlayerTeamType = getOppositeTeamType(this.currentPlayer.teamType);
    if (piece.teamType !== this.currentPlayer.teamType) {
      return false;
    }

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

      this.calculateAllMoves(otherPlayerTeamType);
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
          if (isPawnPromotionMove && updatePromotionPawn) {
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

      this.calculateAllMoves(otherPlayerTeamType);
      this.opponentKingInCheck(piece.teamType);
    } else {
      return false;
    }
    this.updateCurrentPlayer();
    return true;
  }

  updateCurrentPlayer() {
    this.currentPlayer = this.currentPlayer.teamType === TeamType.WHITE ? PLAYERS[1] : PLAYERS[0];
  }

  opponentKingInCheck(teamType) {
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

    this.calculateAllMoves(oppositeTeamType);
  }

  promotePawn(pieceType, promotionPawn, playerTeamType) {
    this.pieces = this.pieces.reduce((results, currentPiece) => {
      if (samePosition(currentPiece.position, promotionPawn.position)) {
        const teamType = (currentPiece.teamType === TeamType.WHITE) ? TeamType.WHITE.toLowerCase() : TeamType.BLACK.toLowerCase();
        currentPiece = new Piece(currentPiece.position, pieceType, teamType);
      }

      results.push(currentPiece);
      return results;
    }, []);

    this.calculateAllMoves(playerTeamType);
  }

  clone() {
    return new Board(this.pieces.map((piece) => piece.clone()), this.currentPlayer);
  }

  unplayMove(move) {
    if (move) {
      this.pieces = move.pieces;
    }
  }
}
