import React, { useState, useEffect, useRef } from "react";

// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from 'enums/TeamType';

// Components
import Chessboard from "components/Chessboard/Chessboard";

// Models
import Position from 'models/Position';
import Player from "models/Player";

// Utilities
import { samePosition, getPositionPointDifference } from "utilities/Position";
import { minimax } from "utilities/AI";

// Constants
import { initialBoard } from "constants/Constants";

// Rules
import { isValidPawnPosition, moveIsPawnPromotion } from "PieceRules/PawnRules";
import { isValidKnightPosition } from "PieceRules/KnightRules";
import { isValidBishopPosition } from "PieceRules/BishopRules";
import { isValidRookPosition } from "PieceRules/RookRules";
import { isValidQueenPosition } from "PieceRules/QueenRules";
import { isValidKingPosition, kingIsChecked } from "PieceRules/KingRules";
import { tileIsOccupied } from "PieceRules/GeneralRules";

/** @TODO Add checkmate // Add stalemate */

/**
 * @description Renders the chessboard and handles game logic related to moves being made on the current board state
 *
 * @returns
 *
 * @example
 * <Referee />
 */
function Referee() {

  const players = [new Player(TeamType.WHITE), new Player(TeamType.BLACK)];

  // ** useRefs ** //
  const modalRef = useRef(null);
  const currentPlayerRef = useRef(players[0]);

  // ** useStates ** //
  const [board, setBoard] = useState(initialBoard);
  const [promotionPawn, setPromotionPawn] = useState();
  const [boardHistory] = useState([]);

  // ** useEffects ** //
  useEffect(() => {
    updatePossibleMoves();
  }, []);

  // ** Functions ** //
  const playComputerMove = () => {
    const bestPieceMove = minimax(board, 3, false);
    playMove(bestPieceMove.pieceMove.piece, bestPieceMove.pieceMove.move);
  };

  const updatePossibleMoves = () => {
    board.calculateAllMoves(currentPlayerRef.current.teamType);
  };

  const updatePromotionPawn = (pawn) => {
    setPromotionPawn(pawn);
  };

  const playMove = (piece, newPosition) => {
    let isPlayedMoveValid = false;

    const isValidMove = moveIsValid(piece.position, newPosition, piece.type, piece.teamType, piece.castleAvailable);
    const isEnPassantMove = moveIsEnpassant(piece.position, newPosition, piece.type, piece.teamType);
    const isPawnPromotionMove = moveIsPawnPromotion(newPosition, piece.type, piece.teamType);
    const isCastleMove = moveIsCastle(piece.position, newPosition, piece.type, piece.teamType, piece.castleAvailable);
    const isKingThreatened = kingIsChecked(piece.teamType, board.pieces);

    const prevBoard = board.clone();

    setBoard((previousBoard) => {
      isPlayedMoveValid = board.playMove(isEnPassantMove, isValidMove, isPawnPromotionMove, isCastleMove, isKingThreatened, piece, newPosition, updatePromotionPawn);
      return board.clone();
    })

    if (isPawnPromotionMove && isPlayedMoveValid) {
      modalRef.current?.classList.remove('hidden');
    }

    if (isPlayedMoveValid) {
      updateBoardHistory(prevBoard);
    }

    return isPlayedMoveValid;
  };

  const moveIsValid = (grabPosition, newPosition, type, teamType, castleAvailable) => {
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
        isValidPosition = isValidKingPosition(grabPosition, newPosition, teamType, board.pieces, castleAvailable);
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

  const updateBoardHistory = (move) => {
    boardHistory.push(move);
  };

  const promotionTeamType = () => {
    return (promotionPawn?.teamType === TeamType.WHITE) ? TeamType.WHITE.toLowerCase() : TeamType.BLACK.toLowerCase();
  };

  const promotePawn = (pieceType) => {
    if (!promotionPawn) return;
    setBoard((previousBoard) => {
      board.promotePawn(pieceType, promotionPawn.clone(), board.currentPlayer.teamType);
      return board.clone();
    })

    modalRef.current?.classList.add('hidden');
  };

  // const unplayMove = () => {
  //   const previousBoardState = boardEvaluationStack.pop();
  //   if (!previousBoardState) return;
  //   return previousBoardState.clone();
  // };

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
      <Chessboard playMove={playMove} pieces={board.pieces} playComputerMove={playComputerMove} />
      {/* <button onClick={() => unplayMove()}>Click Me!</button> */}
    </>
  );
}


export default Referee;