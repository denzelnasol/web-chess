import React, { useState, useEffect } from "react";

// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from 'enums/TeamType';
import { HORIZONTAL_AXIS, VERTICAL_AXIS } from "constants/Constants";

// Models
import Position from 'models/Position';

// Components
import Chessboard from "components/Game/Chessboard/Chessboard";
import PawnPromotionModal from "components/Game/PawnPromotionModal/PawnPromotionModal";
import CheckmateModal from "components/Game/CheckmateModal/CheckmateModal";


// Utilities
import { samePosition, getPositionPointDifference } from "utilities/Position";

// Constants
import { initialBoard } from "constants/Constants";

// Rules
import { isValidPawnPosition, moveIsPawnPromotion } from "Rules/PieceRules/PawnRules";
import { isValidKnightPosition } from "Rules/PieceRules/KnightRules";
import { isValidBishopPosition } from "Rules/PieceRules/BishopRules";
import { isValidRookPosition } from "Rules/PieceRules/RookRules";
import { isValidQueenPosition } from "Rules/PieceRules/QueenRules";
import { isValidKingPosition } from "Rules/PieceRules/KingRules";
import { tileIsOccupied } from "Rules/GeneralRules";
import { getOppositeTeamType } from "utilities/TeamType";
import { kingIsChecked } from "Rules/CheckRules";
import Move from "models/Move";

/**
 * @description Renders the chessboard and handles game logic related to moves being made on the current board state
 *
 * @returns
 *
 * @example
 * <Referee />
 */
function Referee() {
  // ** useStates ** //
  const [board, setBoard] = useState(initialBoard.clone());
  const [promotionPawn, setPromotionPawn] = useState();
  const [showPawnPromotionModal, setShowPawnPromotionModal] = useState(false);
  const [showCheckmateModal, setShowCheckmmateModal] = useState(false);
  const [showStalemateModal, setShowStalemateModal] = useState(false);
  const [moveStack, setMoveStack] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);

  // ** useEffects ** //
  useEffect(() => {
    updatePossibleMoves();
  }, []);

  // ** Functions ** //
  const updatePossibleMoves = () => {
    board.calculateAllMoves(board.currentPlayer.teamType);
  };

  const updatePromotionPawn = (pawn) => {
    setPromotionPawn(pawn);
  };

  const playMove = (piece, newPosition) => {
    let isPlayedMoveValid = false;
    let capturedPiece;

    const prevPosition = piece.position.clone();
    const isValidMove = moveIsValid(piece.position, newPosition, piece.type, piece.teamType, piece.castleAvailable);
    const isEnPassantMove = moveIsEnpassant(piece.position, newPosition, piece.type, piece.teamType);
    const isPawnPromotionMove = moveIsPawnPromotion(newPosition, piece.type, piece.teamType);
    const isCastleMove = moveIsCastle(piece.position, newPosition, piece.type, piece.teamType, piece.castleAvailable);
    const isKingThreatened = kingIsChecked(piece.teamType, board.pieces);

    setBoard((previousBoard) => {
      const result = board.playMove(isEnPassantMove, isValidMove, isPawnPromotionMove, isCastleMove, isKingThreatened, piece, newPosition, updatePromotionPawn);
      isPlayedMoveValid = result.success;
      if (result.capturedPiece) capturedPiece = result.capturedPiece.clone();
      return board.clone();
    })

    if (isPawnPromotionMove && isPlayedMoveValid) {
      setShowPawnPromotionModal(true);
    }
    if (isPlayedMoveValid) {
      const move = new Move(piece, prevPosition, newPosition, capturedPiece);
      setMoveStack(moveStack => [...moveStack, move]);
      checkForCheckmate(piece.teamType);
      checkForStalemate(piece.teamType);
      moveHistory.push(getChessNotationMove(piece, capturedPiece));
      console.log(moveHistory, capturedPiece);
    }

    return isPlayedMoveValid;
  };

  const getChessNotationMove = (piece, capturedPiece) => {
    let notation;
    let capturedPiecePostition;

    if (capturedPiece) {
      capturedPiecePostition = capturedPiece.position;
    }

    console.log(piece.pieceType)
    if (piece.pieceType == PieceType.PAWN) {
      notation = `${HORIZONTAL_AXIS[this.x]}${VERTICAL_AXIS[this.y]}`;
    }

    return notation;
  }

  const moveIsValid = (grabPosition, newPosition, type, teamType, castleAvailable) => {
    let isValidPosition = false;
    switch (type) {
      case PieceType.PAWN:
        isValidPosition = isValidPawnPosition(grabPosition, newPosition, teamType, board);
        break;
      case PieceType.KNIGHT:
        isValidPosition = isValidKnightPosition(grabPosition, newPosition, teamType, board);
        break;
      case PieceType.BISHOP:
        isValidPosition = isValidBishopPosition(grabPosition, newPosition, teamType, board);
        break;
      case PieceType.ROOK:
        isValidPosition = isValidRookPosition(grabPosition, newPosition, teamType, board);
        break;
      case PieceType.QUEEN:
        isValidPosition = isValidQueenPosition(grabPosition, newPosition, teamType, board);
        break;
      case PieceType.KING:
        isValidPosition = isValidKingPosition(grabPosition, newPosition, teamType, board, castleAvailable);
    }
    return isValidPosition;
  };

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
  };

  const moveIsCastle = (grabPosition, newPosition, type, teamType, castleAvailable) => {
    const kingRow = teamType === TeamType.WHITE ? 0 : 7;
    if (type !== PieceType.KING) return false;

    const isKingInPosition = samePosition(grabPosition, new Position(3, kingRow));
    const isLeftKnightPositionEmpty = !tileIsOccupied(new Position(1, kingRow), board.pieces);
    const isLeftBishopPositionEmpty = !tileIsOccupied(new Position(2, kingRow), board.pieces);
    const isLeftNewPositionCorrect = samePosition(newPosition, new Position(1, kingRow));

    // Left Castle
    if (isKingInPosition && isLeftKnightPositionEmpty && isLeftBishopPositionEmpty && isLeftNewPositionCorrect && castleAvailable) {
      const rook = board.pieces.find((piece) =>
        samePosition(new Position(0, kingRow), piece.position) && piece.castleAvailable
      );

      if (rook) return true;
    }

    const isRightKnightPositionEmpty = !tileIsOccupied(new Position(6, kingRow), board.pieces);
    const isRightBishopPositionEmpty = !tileIsOccupied(new Position(5, kingRow), board.pieces);
    const isQueenPositionEmpty = !tileIsOccupied(new Position(4, kingRow), board.pieces);
    const isRightNewPositionCorrect = samePosition(newPosition, new Position(5, kingRow));

    // Right Castle
    if (isKingInPosition && isRightKnightPositionEmpty && isRightBishopPositionEmpty && isQueenPositionEmpty && isRightNewPositionCorrect && castleAvailable) {
      const rook = board.pieces.find((piece) =>
        samePosition(new Position(7, kingRow), piece.position) && piece.castleAvailable
      );
      if (rook) return true;
    }

    return false;
  };

  const checkForCheckmate = () => {
    const pieceMoves = board.getAllPlayerPossiblePieceMoves(board.currentPlayer.teamType);
    if ((pieceMoves.length === 0 || !pieceMoves) && kingIsChecked(board.currentPlayer.teamType, board.pieces)) setShowCheckmmateModal(true);
  }

  const checkForStalemate = () => {
    const pieceMoves = board.getAllPlayerPossiblePieceMoves(board.currentPlayer.teamType);
    if ((pieceMoves.length === 0 || !pieceMoves) && !kingIsChecked(board.currentPlayer.teamType, board.pieces)) setShowStalemateModal(true);
  }

  const promotePawn = (pieceType) => {
    if (!promotionPawn) return;
    setBoard((previousBoard) => {
      board.promotePawn(pieceType, promotionPawn.clone(), board.currentPlayer.teamType);
      return board.clone();
    })
    setShowPawnPromotionModal(false);
  };

  const resetBoard = () => {
    setShowCheckmmateModal(false);
    setShowStalemateModal(false);
    setBoard((previousBoard) => {
      const newboard = initialBoard.clone();
      newboard.calculateAllMoves(newboard.currentPlayer.teamType);
      return newboard;
    })
  }

  return (
    <>
      <PawnPromotionModal
        showPawnPromotionModal={showPawnPromotionModal}
        promotionPawn={promotionPawn}
        promotePawn={promotePawn}
      />

      <CheckmateModal
        showCheckmateModal={showCheckmateModal}
        teamType={getOppositeTeamType(board.currentPlayer.teamType)}
        resetBoard={resetBoard}
        showStalemateModal={showStalemateModal}
      />

      <Chessboard
        playMove={playMove}
        pieces={board.pieces}
      />
    </>
  );
}

export default Referee;