import React, { useState, useEffect, useRef } from "react";

// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from 'enums/TeamType';

// Components
import Chessboard from "components/Chessboard/Chessboard";

// Models
import Position from 'models/Position';

// Utilities
import { samePosition, getPositionPointDifference } from "utilities/Position";

// Constants
import { initialBoard } from "constants/Constants";

// Rules
import { isValidPawnPosition, moveIsPawnPromotion } from "referee/Rules/PawnRules";
import { isValidKnightPosition } from "referee/Rules/KnightRules";
import { isValidBishopPosition } from "referee/Rules/BishopRules";
import { isValidRookPosition } from "referee/Rules/RookRules";
import { isValidQueenPosition } from "referee/Rules/QueenRules";
import { isValidKingPosition } from "referee/Rules/KingRules";

/** @TODO
 * Prevent king from moving into danger
 * Castling
 * Add checkmate
 * Add checks
 * Add stalemate
 */
const Referee = () => {

  const modalRef = useRef(null);

  const [board, setBoard] = useState(initialBoard);
  const [promotionPawn, setPromotionPawn] = useState();

  useEffect(() => {
    updatePossibleMoves();
  }, []);

  const updatePossibleMoves = () => {
    board.calculateAllMoves();
  }

  const updatePromotionPawn = (pawn) => {
    setPromotionPawn(pawn);
  }

  const playMove = (piece, newPosition) => {
    let isPlayedMoveValid = false;

    const isValidMove = moveIsValid(piece.position, newPosition, piece.type, piece.teamType);
    const isEnPassantMove = moveIsEnpassant(piece.position, newPosition, piece.type, piece.teamType);
    const isPawnPromotionMove = moveIsPawnPromotion(newPosition, piece.type, piece.teamType);

    setBoard((previousBoard) => {
      isPlayedMoveValid = board.playMove(isEnPassantMove, isValidMove, isPawnPromotionMove, piece, newPosition, updatePromotionPawn);
      return board.clone();
    })

    if (isPawnPromotionMove && isPlayedMoveValid) {
      modalRef.current?.classList.remove('hidden');
      // setPromotionPawn(piece);
    }

    return isPlayedMoveValid;
  }

  const moveIsValid = (grabPosition, newPosition, type, teamType) => {
    let isValidPosition = false;
    switch (type) {
      case PieceType.PAWN:
        isValidPosition = isValidPawnPosition(grabPosition, newPosition, teamType, board.pieces);
        break;
      case PieceType.KNIGHT:
        isValidPosition = isValidKnightPosition(grabPosition, newPosition, teamType, board.pieces);
        break;
      case PieceType.BISHOP:
        isValidPosition = isValidBishopPosition(grabPosition, newPosition, teamType, board.pieces);
        break;
      case PieceType.ROOK:
        isValidPosition = isValidRookPosition(grabPosition, newPosition, teamType, board.pieces);
        break;
      case PieceType.QUEEN:
        isValidPosition = isValidQueenPosition(grabPosition, newPosition, teamType, board.pieces);
        break;
      case PieceType.KING:
        isValidPosition = isValidKingPosition(grabPosition, newPosition, teamType, board.pieces);
    }
    return isValidPosition;
  }

  const moveIsEnpassant = (grabPosition, newPosition, type, teamType) => {
    const pawnDirection = teamType === TeamType.WHITE ? 1 : -1;
    const xDifference = getPositionPointDifference(newPosition.x, grabPosition.x);
    const yDifference = getPositionPointDifference(newPosition.y, grabPosition.y);
    if (type !== PieceType.PAWN) return false;

    if ((xDifference === -1 || xDifference === 1) && yDifference === pawnDirection) {
      const piece = board.pieces.find((piece) =>
        samePosition(piece.position, new Position(newPosition.x, newPosition.y - pawnDirection)) && piece.enPassant
      );
      if (piece) return true;
    }
    return false;
  }

  const promotionTeamType = () => {
    return (promotionPawn?.teamType === TeamType.WHITE) ? TeamType.WHITE.toLowerCase() : TeamType.BLACK.toLowerCase();
  }

  const promotePawn = (pieceType) => {
    if (!promotionPawn) return;
    setBoard((previousBoard) => {
      board.promotePawn(pieceType, promotionPawn.clone());
      return board.clone();
    })

    modalRef.current?.classList.add('hidden');
  }

  return (
    <>
      <div className="pawn-promotion-modal hidden" ref={modalRef}>
        <div className="modal-body">
          {/* Pawn Promotion Modal! */}
          <img onClick={() => promotePawn(PieceType.ROOK)} src={`images/${promotionTeamType()}-rook.png`} />
          <img onClick={() => promotePawn(PieceType.BISHOP)} src={`images/${promotionTeamType()}-bishop.png`} />
          <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`images/${promotionTeamType()}-knight.png`} />
          <img onClick={() => promotePawn(PieceType.QUEEN)} src={`images/${promotionTeamType()}-queen.png`} />
        </div>
      </div>
      <Chessboard playMove={playMove} pieces={board.pieces} />
    </>
  );
}


export default Referee;