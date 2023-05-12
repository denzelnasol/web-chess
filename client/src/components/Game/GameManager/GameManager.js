import React, { useState, useEffect, useRef } from "react";

// API
import { updateMoveHistory } from "api/Game";

// Enums
import { PieceType, PIECE_TYPE_TO_LETTER, LETTER_TO_PIECE_TYPE } from "enums/PieceType";
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
import { getOppositeTeamType } from "utilities/TeamType";

// Rules
import { isValidPawnPosition, moveIsPawnPromotion } from "Rules/PieceRules/PawnRules";
import { isValidKnightPosition } from "Rules/PieceRules/KnightRules";
import { isValidBishopPosition } from "Rules/PieceRules/BishopRules";
import { isValidRookPosition } from "Rules/PieceRules/RookRules";
import { isValidQueenPosition } from "Rules/PieceRules/QueenRules";
import { isValidKingPosition } from "Rules/PieceRules/KingRules";
import { tileIsOccupied } from "Rules/GeneralRules";
import { kingIsChecked, kingIsThreatened } from "Rules/CheckRules";

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
const GameManager = ({ ...props }) => {

  const { board, notation, account, players } = props;

  const playerColorRef = useRef(undefined);

  // ** useStates ** //
  const [promotionPawn, setPromotionPawn] = useState();
  const [showPawnPromotionModal, setShowPawnPromotionModal] = useState(false);
  const [showCheckmateModal, setShowCheckmmateModal] = useState(false);
  const [showStalemateModal, setShowStalemateModal] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [playerColor, setPlayerColor] = useState(undefined);

  // ** useEffects ** //
  useEffect(() => {
    if (!board || !account || !players || !moveHistory) return;
    updatePossibleMoves();
    for (const player of players) {
      if (account.id === player.id) {
        playerColorRef.current = player.color;
        setPlayerColor(player.color);
      }
    }
  }, [board, account, players, moveHistory]);

  useEffect(() => {
    if (!notation || notation.length === 0 || !players || players.length === 0) return;
    for (const player of players) {
      if (account.id === player.id) {
        playerColorRef.current = player.color;
        setPlayerColor(player.color);
      }
    }

    const notations = notation.split(' ');
    for (const notation of notations) {
      parseMove(notation);
    }
    setMoveHistory(notation.split(' '));
  }, [notation, players]);

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

  const parseMove = (notation) => {
    if (!notation || !board) return;
    let refactoredNotation = notation.split('->').map(pos => pos.replace(/.*?(?=x)/, ''));
    let promotionPieceType = notation.includes('=') ? notation.substring(notation.length - 1) : undefined;

    if (promotionPieceType) promotionPieceType = LETTER_TO_PIECE_TYPE[promotionPieceType];
    promotionPieceType = promotionPieceType === PieceType.KING ? PieceType.KNIGHT : promotionPieceType;
    const [startNotation, endNotation] = refactoredNotation.map((pos) => pos.replace(/[A-ZxO+#\-\W]/g, ''));
    const [startX, startY] = startNotation.split('');
    const [endX, endY] = endNotation.split('');
    const startPosition = new Position(HORIZONTAL_AXIS.indexOf(startX), VERTICAL_AXIS.indexOf(startY));
    const endPosition = new Position(HORIZONTAL_AXIS.indexOf(endX), VERTICAL_AXIS.indexOf(endY));

    const piece = board.getPieceFromPosition(startPosition);
    if (piece) playMove(piece, endPosition, true, promotionPieceType);
  };

  const playMove = (piece, newPosition, isHistoryMove, promotionPieceType) => {
    if (!isHistoryMove) {
      if (board.currentPlayer.teamType !== playerColor) {
        return false;
      }
    }
    let isPlayedMoveValid = false;
    const prevBoard = board.clone();
    const isValidMove = moveIsValid(piece.position, newPosition, piece.type, piece.teamType, piece.castleAvailable);
    const isEnPassantMove = moveIsEnpassant(piece.position, newPosition, piece.type, piece.teamType);
    const isPawnPromotionMove = moveIsPawnPromotion(newPosition, piece.type, piece.teamType);
    const isCastleMove = moveIsCastle(piece.position, newPosition, piece.type, piece.teamType, piece.castleAvailable);
    const isKingThreatened = kingIsThreatened(piece.teamType, board.pieces);
    let { success, capturedPiece } = board.playMove(isEnPassantMove, isValidMove, isPawnPromotionMove, isCastleMove, isKingThreatened, piece, newPosition, updatePromotionPawn);
    const isCheckMove = kingIsChecked(board.currentPlayer.teamType, board.pieces);

    props.updateBoard();
    isPlayedMoveValid = success;
    if (capturedPiece) capturedPiece = capturedPiece.clone();

    if (isPawnPromotionMove && isPlayedMoveValid && playerColorRef.current === piece.teamType && !isHistoryMove) {
      setShowPawnPromotionModal(true);
    } else if (isPawnPromotionMove && isPlayedMoveValid && isHistoryMove && promotionPieceType) {
      promotePawn(promotionPieceType, isHistoryMove, piece);
    }

    if (isPlayedMoveValid) {
      const isCheckmate = checkForCheckmate();
      checkForStalemate();
      const notationMove = getChessNotationMove(piece, newPosition, capturedPiece, isCheckmate, isCastleMove, isCheckMove);

      if (!isHistoryMove) {
        props.updateNotation(notationMove);
        props.emitMove(notationMove);
      }
    }

    return isPlayedMoveValid;
  };

  const getChessNotationMove = (piece, newPosition, capturedPiece, isCheckmate, isCastleMove, isCheckMove) => {
    const captured = capturedPiece ? "x" : "";
    let notation;
    if (piece.type === PieceType.KING && isCastleMove) {
      const isKingsideCastle = newPosition.x === 1;
      notation = isKingsideCastle ? `O-O${HORIZONTAL_AXIS[newPosition.x]}${VERTICAL_AXIS[newPosition.y]}`
        : `O-O-O${HORIZONTAL_AXIS[newPosition.x]}${VERTICAL_AXIS[newPosition.y]}`;
    } else {
      let type = PIECE_TYPE_TO_LETTER[piece.type];
      if (type === PIECE_TYPE_TO_LETTER[PieceType.PAWN]) type = captured ? HORIZONTAL_AXIS[piece.position.x] : '';
      notation = type + captured + HORIZONTAL_AXIS[newPosition.x] + VERTICAL_AXIS[newPosition.y];
    }
    notation += isCheckmate ? "#" : isCheckMove ? "+" : "";
    notation = `${HORIZONTAL_AXIS[piece.position.x]}${VERTICAL_AXIS[piece.position.y]}->${notation}`;
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
    const isCheckmate = (pieceMoves.length === 0 || !pieceMoves) && kingIsChecked(board.currentPlayer.teamType, board.pieces);
    if (isCheckmate) setShowCheckmmateModal(true);
    return isCheckmate;
  }

  const checkForStalemate = () => {
    const pieceMoves = board.getAllPlayerPossiblePieceMoves(board.currentPlayer.teamType);
    if ((pieceMoves.length === 0 || !pieceMoves) && !kingIsChecked(board.currentPlayer.teamType, board.pieces)) setShowStalemateModal(true);
  }

  const promotePawn = (pieceType, isHistoryMove, promotionPawn) => {
    if (!promotionPawn) return;

    if (!isHistoryMove) {
      let newPawnPromotionNotation = notation.split(' ');
      newPawnPromotionNotation = newPawnPromotionNotation[newPawnPromotionNotation.length - 1];
      newPawnPromotionNotation = newPawnPromotionNotation.concat(`=${pieceType.substring(0, 1)}`);

      props.updateNotation(undefined, `=${pieceType.substring(0, 1)}`);
      const data = {
        type: pieceType,
        position: promotionPawn.position,
        promotionNotation: newPawnPromotionNotation,
      }
      props.emitPawnPromotion(data);
    }
    board.promotePawn(pieceType, promotionPawn.clone(), board.currentPlayer.teamType);
    props.updateBoard();

    setShowPawnPromotionModal(false);
  }

  const resetBoard = () => {
    setShowCheckmmateModal(false);
    setShowStalemateModal(false);
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
        playerColor={playerColor}
        currentPlayer={board ? board.currentPlayer : undefined}
      />
    </div>
  );
}

export default GameManager;