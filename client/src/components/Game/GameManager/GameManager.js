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
import { getPossibleKnightMoves, isValidKnightPosition } from "Rules/PieceRules/KnightRules";
import { isValidBishopPosition } from "Rules/PieceRules/BishopRules";
import { isValidRookPosition } from "Rules/PieceRules/RookRules";
import { isValidQueenPosition } from "Rules/PieceRules/QueenRules";
import { isValidKingPosition } from "Rules/PieceRules/KingRules";
import { tileIsOccupied } from "Rules/GeneralRules";
import { getOppositeTeamType } from "utilities/TeamType";
import { kingIsChecked, kingIsThreatened } from "Rules/CheckRules";

// Styling
import './style.scss';
import { updateMoveHistory } from "api/Game";

/**
 * @description Renders the chessboard and handles game logic related to moves being made on the current board state
 *
 * @returns
 *
 * @example
 * <GameManager />
 */
const GameManager = ({ ...props }) => {
  // ** useStates ** //
  const [board, setBoard] = useState(props.board);
  const [promotionPawn, setPromotionPawn] = useState();
  const [showPawnPromotionModal, setShowPawnPromotionModal] = useState(false);
  const [showCheckmateModal, setShowCheckmmateModal] = useState(false);
  const [showStalemateModal, setShowStalemateModal] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);

  // ** useEffects ** //
  useEffect(() => {
    setBoard(props.board);
  }, [props.board]);

  useEffect(() => {
    updatePossibleMoves();
  }, [board]);

  useEffect(() => {
    if (!props.notation) return;
    setMoveHistory(props.notation.split(' '));
  }, [props.notation]);

  useEffect(() => {
    const updateMoves = async () => {
      if (moveHistory.length === 0 || !moveHistory) return;
      const stringifiedMoveHistory = moveHistory.join(' ');
      await updateMoveHistory(props.gameId, stringifiedMoveHistory);
    }

    updateMoves();
  }, [moveHistory]);

  // ** Functions ** //
  const updatePossibleMoves = () => {
    if (!board) return;
    board.calculateAllMoves(board ? board.currentPlayer.teamType : TeamType.WHITE);
  };

  const updatePromotionPawn = (pawn) => {
    setPromotionPawn(pawn);
  };

  const playMove = (piece, newPosition) => {
    let isPlayedMoveValid = false;
    const prevBoard = board.clone();
    const isValidMove = moveIsValid(piece.position, newPosition, piece.type, piece.teamType, piece.castleAvailable);
    const isEnPassantMove = moveIsEnpassant(piece.position, newPosition, piece.type, piece.teamType);
    const isPawnPromotionMove = moveIsPawnPromotion(newPosition, piece.type, piece.teamType);
    const isCastleMove = moveIsCastle(piece.position, newPosition, piece.type, piece.teamType, piece.castleAvailable);
    const isKingThreatened = kingIsThreatened(piece.teamType, board.pieces);
    let { success, capturedPiece } = board.playMove(isEnPassantMove, isValidMove, isPawnPromotionMove, isCastleMove, isKingThreatened, piece, newPosition, updatePromotionPawn);
    const isCheckMove = kingIsChecked(board.currentPlayer.teamType, board.pieces);

    setBoard((previousBoard) => {
      isPlayedMoveValid = success;
      if (capturedPiece) capturedPiece = capturedPiece.clone();
      return board.clone();
    })

    if (isPawnPromotionMove && isPlayedMoveValid) {
      setShowPawnPromotionModal(true);
    }

    if (isPlayedMoveValid) {
      const isCheckmate = checkForCheckmate();
      checkForStalemate();
      setMoveHistory([...moveHistory, getChessNotationMove(piece, newPosition, capturedPiece, prevBoard, isCheckmate, isCastleMove, isCheckMove)]);
    }

    return isPlayedMoveValid;
  };

  const getChessNotationMove = (piece, newPosition, capturedPiece, prevBoard, isCheckmate, isCastleMove, isCheck) => {
    const captured = capturedPiece ? "x" : "";
    let notation;
    switch (piece.type) {
      case PieceType.PAWN:
        notation =
          captured +
          HORIZONTAL_AXIS[newPosition.x] +
          VERTICAL_AXIS[newPosition.y];
        break;
      case PieceType.KNIGHT: {
        const disambiguation = getDisambiguation(piece, newPosition, prevBoard);
        notation =
          "N" +
          disambiguation +
          captured +
          HORIZONTAL_AXIS[newPosition.x] +
          VERTICAL_AXIS[newPosition.y];
        break;
      }
      case PieceType.BISHOP:
        notation =
          "B" +
          getDisambiguation(piece, newPosition, prevBoard) +
          captured +
          HORIZONTAL_AXIS[newPosition.x] +
          VERTICAL_AXIS[newPosition.y];
        break;
      case PieceType.ROOK:
        notation =
          "R" +
          getDisambiguation(piece, newPosition, prevBoard) +
          captured +
          HORIZONTAL_AXIS[newPosition.x] +
          VERTICAL_AXIS[newPosition.y];
        break;
      case PieceType.QUEEN:
        notation =
          "Q" +
          getDisambiguation(piece, newPosition, prevBoard) +
          captured +
          HORIZONTAL_AXIS[newPosition.x] +
          VERTICAL_AXIS[newPosition.y];
        break;
      case PieceType.KING:
        if (isCastleMove) {
          const isKingsideCastle = newPosition.x === 1;
          const castleNotation = isKingsideCastle ? "O-O" : "O-O-O";
          notation = castleNotation;
        } else {
          notation =
            "K" +
            getDisambiguation(piece, newPosition, prevBoard) +
            captured +
            HORIZONTAL_AXIS[newPosition.x] +
            VERTICAL_AXIS[newPosition.y];
        }
        break;
      default:
        throw new Error(`Invalid piece type: ${piece.type}`);
    }

    notation += isCheckmate ? "#" : isCheck ? "+" : "";
    notation = `${HORIZONTAL_AXIS[piece.position.x]}${VERTICAL_AXIS[piece.position.y]}->${notation}`;
    return notation;
  }

  const checkForAmbiguousPieces = (newPosition, type, team, prevBoard) => {
    const ambiguousPieces = prevBoard.pieces.filter((piece) => {
      if (piece.type !== type || piece.teamType !== team) return;
      let isAmbiguous = piece.possibleMoves.some((move) => move.x === newPosition.x && move.y === newPosition.y);
      return isAmbiguous;
    })
    return !(ambiguousPieces.length === 1);
  }

  const getDisambiguation = (piece, newPosition, prevBoard) => {
    const isAmbiguous = checkForAmbiguousPieces(newPosition, piece.type, piece.teamType, prevBoard);
    if (!isAmbiguous) return '';

    const samePieces = prevBoard.pieces.filter(p => p.type === piece.type && p.teamType === piece.teamType);

    if (samePieces.length <= 1) return '';

    const sameRow = samePieces.filter(p => p.position.y === piece.position.y);
    const sameCol = samePieces.filter(p => p.position.x === piece.position.x);

    if (sameRow.length > 1 && sameCol.length > 1) return HORIZONTAL_AXIS[piece.position.x];
    else if (sameRow.length > 1) return HORIZONTAL_AXIS[piece.position.x];
    else if (sameCol.length > 1) return VERTICAL_AXIS[piece.position.y];
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
    const isCheckmate = (pieceMoves.length === 0 || !pieceMoves) && kingIsChecked(board.currentPlayer.teamType, board.pieces);
    if (isCheckmate) setShowCheckmmateModal(true);
    return isCheckmate;
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
        teamType={board ? getOppositeTeamType(board.currentPlayer.teamType) : undefined}
        resetBoard={resetBoard}
        showStalemateModal={showStalemateModal}
      />

      <Chessboard
        playMove={playMove}
        pieces={board ? board.pieces : []}
      />
    </div>
  );
}

export default GameManager;