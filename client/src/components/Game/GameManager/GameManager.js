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

// Styling
import './style.scss';

/**
 * @description Renders the chessboard and handles game logic related to moves being made on the current board state
 *
 * @returns
 *
 * @example
 * <GameManager />
 */
const GameManager = () => {
  // ** useStates ** //
  const [board, setBoard] = useState(initialBoard.clone());
  const [promotionPawn, setPromotionPawn] = useState();
  const [showPawnPromotionModal, setShowPawnPromotionModal] = useState(false);
  const [showCheckmateModal, setShowCheckmmateModal] = useState(false);
  const [showStalemateModal, setShowStalemateModal] = useState(false);
  const [moveStack, setMoveStack] = useState([]);
  const [moveHistory] = useState([]);

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
    // let capturedPiece;

    const prevPosition = piece.position.clone();
    const isValidMove = moveIsValid(piece.position, newPosition, piece.type, piece.teamType, piece.castleAvailable);
    const isEnPassantMove = moveIsEnpassant(piece.position, newPosition, piece.type, piece.teamType);
    const isPawnPromotionMove = moveIsPawnPromotion(newPosition, piece.type, piece.teamType);
    const isCastleMove = moveIsCastle(piece.position, newPosition, piece.type, piece.teamType, piece.castleAvailable);
    const isKingThreatened = kingIsChecked(piece.teamType, board.pieces);
    let { success, capturedPiece } = board.playMove(isEnPassantMove, isValidMove, isPawnPromotionMove, isCastleMove, isKingThreatened, piece, newPosition, updatePromotionPawn);

    setBoard((previousBoard) => {
      isPlayedMoveValid = success;
      if (capturedPiece) capturedPiece = capturedPiece.clone();
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
    }

    return isPlayedMoveValid;
  };

  const getChessNotationMove = (piece, capturedPiece) => {
    let notation;
    let capturedPiecePostition;

    if (capturedPiece) capturedPiecePostition = capturedPiece.position;

    if (piece.pieceType == PieceType.PAWN) {
      notation = `${HORIZONTAL_AXIS[this.x]}${VERTICAL_AXIS[this.y]}`;
    }

    return notation;
  }

  const pieceTypeValidations = {
    [PieceType.PAWN]: isValidPawnPosition,
    [PieceType.KNIGHT]: isValidKnightPosition,
    [PieceType.BISHOP]: isValidBishopPosition,
    [PieceType.ROOK]: isValidRookPosition,
    [PieceType.QUEEN]: isValidQueenPosition,
    [PieceType.KING]: isValidKingPosition,
  };

  const moveIsValid = (grabPosition, newPosition, type, teamType, castleAvailable) => {
    const validatePosition = pieceTypeValidations[type];
    return validatePosition(grabPosition, newPosition, teamType, board, castleAvailable);
  };


  const moveIsEnpassant = (grabPosition, newPosition, type, teamType) => {
    if (type !== PieceType.PAWN) return false;
    const pawnDirection = teamType === TeamType.WHITE ? 1 : -1;
    const xDifference = getPositionPointDifference(newPosition.x, grabPosition.x);
    const yDifference = getPositionPointDifference(newPosition.y, grabPosition.y);

    if ((xDifference === -1 || xDifference === 1) && yDifference === pawnDirection) {
      return board.pieces.some((piece) => samePosition(piece.position, new Position(newPosition.x, newPosition.y - pawnDirection)) && piece.enPassant);
    }
    return false;
  };

  const moveIsCastle = (grabPosition, newPosition, type, teamType, castleAvailable) => {
    if (type !== PieceType.KING || !castleAvailable) return false;
    const kingRow = teamType === TeamType.WHITE ? 0 : 7;
    const isKingInPosition = samePosition(grabPosition, new Position(3, kingRow));
    const isLeftNewPositionCorrect = samePosition(newPosition, new Position(1, kingRow));
    const isRightNewPositionCorrect = samePosition(newPosition, new Position(5, kingRow));

    // Left Castle
    if (isKingInPosition && isLeftNewPositionCorrect) {
      const isLeftKnightPositionEmpty = !tileIsOccupied(new Position(1, kingRow), board.pieces);
      const isLeftBishopPositionEmpty = !tileIsOccupied(new Position(2, kingRow), board.pieces);
      if (isLeftKnightPositionEmpty && isLeftBishopPositionEmpty) {
        const rook = board.pieces.find((piece) => samePosition(new Position(0, kingRow), piece.position) && piece.castleAvailable);
        if (rook) return true;
      }
    }

    // Right Castle
    if (isKingInPosition && isRightNewPositionCorrect) {
      const isRightKnightPositionEmpty = !tileIsOccupied(new Position(6, kingRow), board.pieces);
      const isRightBishopPositionEmpty = !tileIsOccupied(new Position(5, kingRow), board.pieces);
      const isQueenPositionEmpty = !tileIsOccupied(new Position(4, kingRow), board.pieces);
      if (isRightKnightPositionEmpty && isRightBishopPositionEmpty && isQueenPositionEmpty) {
        const rook = board.pieces.find((piece) => samePosition(new Position(7, kingRow), piece.position) && piece.castleAvailable);
        if (rook) return true;
      }
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
    board.promotePawn(pieceType, promotionPawn.clone(), board.currentPlayer.teamType);
    setBoard(board.clone());
    setShowPawnPromotionModal(false);
  }
  
  const resetBoard = () => {
    setShowCheckmmateModal(false);
    setShowStalemateModal(false);
    setBoard(initialBoard.clone().calculateAllMoves(initialBoard.currentPlayer.teamType));
  }
  

  return (
    <div className="game-manager">
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
    </div>
  );
}

export default GameManager;