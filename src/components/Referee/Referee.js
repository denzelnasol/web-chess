import React, { useState, useEffect, useRef } from "react";

// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from 'enums/TeamType';
import { PieceValue } from "enums/Evaluation";

// Components
import Chessboard from "components/Chessboard/Chessboard";

// Models
import Position from 'models/Position';
import Player from "models/Player";
import Move from "models/Move";
import MoveGeneration from "models/MoveGeneration";

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
import { isValidKingPosition, kingIsChecked } from "referee/Rules/KingRules";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "referee/Rules/GeneralRules";
import { getOppositeTeamType } from "utilities/TeamType";


/** @TODO
 * Add checkmate
 * Add stalemate
 */
const Referee = () => {

  const players = [new Player(TeamType.WHITE), new Player(TeamType.BLACK)];

  const modalRef = useRef(null);

  const currentPlayerRef = useRef(players[0]);

  const [board, setBoard] = useState(initialBoard);
  const [promotionPawn, setPromotionPawn] = useState();
  const [boardHistory, setBoardHistory] = useState([]);

  useEffect(() => {
    updatePossibleMoves();
    console.log(search(2, currentPlayerRef.current.teamType));
    // console.log(moveGenerationTest(2, currentPlayerRef.current.teamType));
  }, []);

  // useEffect(() => {
  //   if (currentPlayer.teamType === TeamType.BLACK) {
  //     playComputerMove();
  //   }
  // }, [currentPlayer])

  const moveGenerationTest = (depth, teamType) => {
    if (depth == 0) return 1;

    const allPlayerPossiblePieceMoves = board.getAllPlayerPossiblePieceMoves(teamType, board.pieces);
    let moves = 0;

    for (let i = 0; i < allPlayerPossiblePieceMoves.length; i++) {
      console.log(allPlayerPossiblePieceMoves[i].piece);
      playMove(allPlayerPossiblePieceMoves[i].piece, allPlayerPossiblePieceMoves[i].move);
      moves += moveGenerationTest(depth - 1, getOppositeTeamType(teamType));
      unplayMove();
    }
    return moves;
  };

  const playComputerMove = () => {
    const boardClone = board.clone();
    const bestPieceMove = search(2, TeamType.BLACK);
    console.log(bestPieceMove)
    // setBoard((previousBoard) => {
    //   return boardClone;
    // })
    // playMove(bestPieceMove.piece, bestPieceMove.move, true);
  };

  const updatePossibleMoves = () => {
    board.calculateAllMoves(currentPlayerRef.current.teamType);
    // moveGenerationTest(1);
  };

  const updatePromotionPawn = (pawn) => {
    setPromotionPawn(pawn);
  };
  // console.log(currentPlayerRef.current.teamType)
  const playMove = (piece, newPosition, isComputerMove) => {
    let isPlayedMoveValid = false;

    const isValidMove = moveIsValid(piece.position, newPosition, piece.type, piece.teamType, piece.castleAvailable);
    const isEnPassantMove = moveIsEnpassant(piece.position, newPosition, piece.type, piece.teamType);
    const isPawnPromotionMove = moveIsPawnPromotion(newPosition, piece.type, piece.teamType);
    const isCastleMove = moveIsCastle(piece.position, newPosition, piece.type, piece.teamType, piece.castleAvailable);
    const isKingThreatened = kingIsChecked(piece.teamType, board.pieces);
    const isValidPlayer = playerIsValid(piece.teamType);
    // console.log(isValidMove, isEnPassantMove, isPawnPromotionMove, isCastleMove, isKingThreatened, isValidPlayer)
    const prevBoard = board.clone();

    setBoard((previousBoard) => {
      isPlayedMoveValid = board.playMove(isEnPassantMove, isValidMove, isPawnPromotionMove, isCastleMove, isKingThreatened, isValidPlayer, piece, newPosition, updatePromotionPawn, currentPlayerRef.current.teamType, updateCurrentPlayer);
      return board.clone();
    })

    if (isPawnPromotionMove && isPlayedMoveValid) {
      modalRef.current?.classList.remove('hidden');
    }

    if (isPlayedMoveValid) {
      updateBoardHistory(prevBoard);
      // if (!isComputerMove) playComputerMove();
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

  const playerIsValid = (teamType) => {
    return currentPlayerRef.current.teamType === teamType;
  };

  const updateCurrentPlayer = () => {
    const newCurrentPlayer = currentPlayerRef.current.teamType === TeamType.WHITE ? players[1] : players[0];

    currentPlayerRef.current = newCurrentPlayer;
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
      board.promotePawn(pieceType, promotionPawn.clone(), currentPlayerRef.current.teamType);
      return board.clone();
    })

    modalRef.current?.classList.add('hidden');
  };

  const evaluate = () => {
    const whiteEvaluationValue = countMaterialValue(TeamType.WHITE);
    const blackEvaluationValue = countMaterialValue(TeamType.BLACK);

    const evaluation = whiteEvaluationValue - blackEvaluationValue;

    const perspective = currentPlayerRef.current.teamType === TeamType.WHITE ? 1 : -1;

    return evaluation * perspective;
  };

  const countMaterialValue = (teamtype) => {
    let materialValue = 0;
    board.pieces.forEach((piece) => {
      if (piece.teamType !== teamtype) return;

      switch (piece.type) {
        case PieceType.PAWN:
          materialValue += PieceValue.PAWN;
          break;
        case PieceType.BISHOP:
          materialValue += PieceValue.BISHOP;
          break;
        case PieceType.KNIGHT:
          materialValue += PieceValue.KNIGHT;
          break;
        case PieceType.ROOK:
          materialValue += PieceValue.ROOK;
          break;
        case PieceType.QUEEN:
          materialValue += PieceValue.QUEEN;
          break;
        default:
      }
    });

    return materialValue;
  };

  const search = (depth, teamType) => {
    if (depth == 0) return evaluate();

    const allPlayerPossiblePieceMoves = board.getAllPlayerPossiblePieceMoves(teamType, board.pieces);
    // console.log(teamType, allPlayerPossiblePieceMoves)
    if (allPlayerPossiblePieceMoves.length === 0) {
      // if player in checkmate, return negative infinity
      return 0;
    }

    let bestEvaluation = Number.NEGATIVE_INFINITY;
    let bestPieceMove = allPlayerPossiblePieceMoves[0];
    for (let i = 0; i < allPlayerPossiblePieceMoves.length; i++) {
      playMove(allPlayerPossiblePieceMoves[i].piece, allPlayerPossiblePieceMoves[i].move);
      const evaluation = -search(depth - 1, getOppositeTeamType(teamType));
      bestEvaluation = Math.max(evaluation, bestEvaluation);
      if (evaluation >= bestEvaluation) {
        bestPieceMove = allPlayerPossiblePieceMoves[i];
      }
      unplayMove();
    }

    return bestPieceMove;
  };

  const unplayMove = () => {
    const previousBoardState = boardHistory.pop();

    if (!previousBoardState) return;
    setBoard((previousBoard) => {
      // board.unplayMove(previousBoardState);
      return previousBoardState.clone();
    })
    updateCurrentPlayer();
  };
  // console.log(currentPlayerRef.current)
  console.log(boardHistory)
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
      <button onClick={() => unplayMove()}>Click Me!</button>
    </>
  );
}


export default Referee;