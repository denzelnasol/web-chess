// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from 'enums/TeamType';
import { PieceValue } from "enums/Evaluation";

// Models
import Position from 'models/Position';
import Move from "models/Move";

// Utilities
import { samePosition, getPositionPointDifference } from "utilities/Position";

// Rules
import { isValidPawnPosition, moveIsPawnPromotion } from "Rules/PieceRules/PawnRules";
import { isValidKnightPosition } from "Rules/PieceRules/KnightRules";
import { isValidBishopPosition } from "Rules/PieceRules/BishopRules";
import { isValidRookPosition } from "Rules/PieceRules/RookRules";
import { isValidQueenPosition } from "Rules/PieceRules/QueenRules";
import { isValidKingPosition } from "Rules/PieceRules/KingRules";
import { tileIsOccupied } from "Rules/GeneralRules";
import { kingIsChecked } from "Rules/CheckRules";
import { getOppositeTeamType } from "./TeamType";

const moveStack = [];

export const minimax = (currBoard, depth, alpha, beta, maximizingPlayer) => {
  if (depth === 0) {
    return { pieceMove: null, currEval: heuristicEvaluation(currBoard) };
  }

  const allPlayerPossiblePieceMoves = currBoard.getAllPlayerPossiblePieceMoves(currBoard.currentPlayer.teamType);
  // console.log(allPlayerPossiblePieceMoves, maximizingPlayer)
  let bestPieceMove = Math.floor(Math.random() * allPlayerPossiblePieceMoves.length);
  if (maximizingPlayer) {
    let maxEval = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < allPlayerPossiblePieceMoves.length; i++) {
      playMove(allPlayerPossiblePieceMoves[i].piece, allPlayerPossiblePieceMoves[i].move, currBoard);
      const { pm, currEval } = minimax(currBoard, depth - 1, alpha, beta, false);
      unplayMove(currBoard);
      if (currEval > maxEval) {
        maxEval = currEval;
        bestPieceMove = allPlayerPossiblePieceMoves[i];
        // console.log('max: ', bestPieceMove);
      }
      alpha = Math.max(alpha, currEval);
      if (beta <= alpha) {
        break;
      }

    }
    // console.log('maxEval: ', maxEval);
    return { pieceMove: bestPieceMove, currEval: maxEval };
  } else {
    let minEval = Number.POSITIVE_INFINITY;
    for (let i = 0; i < allPlayerPossiblePieceMoves.length; i++) {
      playMove(allPlayerPossiblePieceMoves[i].piece, allPlayerPossiblePieceMoves[i].move, currBoard);
      const { pm, currEval } = minimax(currBoard, depth - 1, alpha, beta, true);
      unplayMove(currBoard);
      if (currEval < minEval) {
        minEval = currEval;
        bestPieceMove = allPlayerPossiblePieceMoves[i];
        // console.log('min: ', bestPieceMove);
      }
      beta = Math.min(beta, currEval);
      if (beta <= alpha) {
        break;
      }
    }
    // console.log('minEval: ', minEval)
    return { pieceMove: bestPieceMove, currEval: minEval };
  }
}

const heuristicEvaluation = (currBoard) => {
  const whiteEvaluationValue = countMaterialValue(currBoard, TeamType.WHITE);
  const blackEvaluationValue = countMaterialValue(currBoard, TeamType.BLACK);

  const evaluation = whiteEvaluationValue - blackEvaluationValue;

  const perspective = currBoard.currentPlayer.teamType === TeamType.WHITE ? 1 : -1;
  return evaluation * perspective;
};

const countMaterialValue = (currBoard, teamType) => {
  let materialValue = 0;
  currBoard.pieces.forEach((piece) => {
    if (piece.teamType !== teamType) return;

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

const playMove = (piece, newPosition, currBoard) => {
  // console.log(newPosition, piece)
  const isValidMove = moveIsValid(piece.position, newPosition, piece.type, piece.teamType, piece.castleAvailable, currBoard);
  const isEnPassantMove = moveIsEnpassant(piece.position, newPosition, piece.type, piece.teamType, currBoard);
  const isPawnPromotionMove = moveIsPawnPromotion(newPosition, piece.type, piece.teamType);
  const isCastleMove = moveIsCastle(piece.position, newPosition, piece.type, piece.teamType, piece.castleAvailable, currBoard);
  const isKingThreatened = kingIsChecked(piece.teamType, currBoard.pieces);
  
  const prevPosition = piece.position.clone();

  const updatePromotionPawn = null  // @TODO: refactor pawn promotion for AI evaluation
  const result = currBoard.playMove(isEnPassantMove, isValidMove, isPawnPromotionMove, isCastleMove, isKingThreatened, piece, newPosition, updatePromotionPawn);
  if (result.success) {
    const move = new Move(piece, prevPosition, newPosition, result.capturedPiece);
    moveStack.push(move);
  }
}

const unplayMove = (currBoard) => {
  const move = moveStack.pop();
  // console.log(move)
  if (move) currBoard.unplayMove(move);
};

const moveIsValid = (grabPosition, newPosition, type, teamType, castleAvailable, currBoard) => {
  let isValidPosition = false;
  switch (type) {
    case PieceType.PAWN:
      isValidPosition = isValidPawnPosition(grabPosition, newPosition, teamType, currBoard);
      break;
    case PieceType.KNIGHT:
      isValidPosition = isValidKnightPosition(grabPosition, newPosition, teamType, currBoard);
      break;
    case PieceType.BISHOP:
      isValidPosition = isValidBishopPosition(grabPosition, newPosition, teamType, currBoard);
      break;
    case PieceType.ROOK:
      isValidPosition = isValidRookPosition(grabPosition, newPosition, teamType, currBoard);
      break;
    case PieceType.QUEEN:
      isValidPosition = isValidQueenPosition(grabPosition, newPosition, teamType, currBoard);
      break;
    case PieceType.KING:
      isValidPosition = isValidKingPosition(grabPosition, newPosition, teamType, currBoard, castleAvailable);
  }
  return isValidPosition;
};

const moveIsEnpassant = (grabPosition, newPosition, type, teamType, currBoard) => {
  const pawnDirection = teamType === TeamType.WHITE ? 1 : -1;
  const xDifference = getPositionPointDifference(newPosition.x, grabPosition.x);
  const yDifference = getPositionPointDifference(newPosition.y, grabPosition.y);
  if (type !== PieceType.PAWN) return false;

  if ((xDifference === -1 || xDifference === 1) && yDifference === pawnDirection) {
    const piece = currBoard.pieces.find((piece) =>
      samePosition(piece.position, new Position(newPosition.x, newPosition.y - pawnDirection)) && piece.enPassant
    );
    if (piece) return true;
  }
  return false;
};

const moveIsCastle = (grabPosition, newPosition, type, teamType, castleAvailable, currBoard) => {
  const kingRow = teamType === TeamType.WHITE ? 0 : 7;
  if (type !== PieceType.KING) return false;

  const isKingInPosition = samePosition(grabPosition, new Position(3, kingRow));
  const isLeftKnightPositionEmpty = !tileIsOccupied(new Position(1, kingRow), currBoard.pieces);
  const isLeftBishopPositionEmpty = !tileIsOccupied(new Position(2, kingRow), currBoard.pieces);
  const isLeftNewPositionCorrect = samePosition(newPosition, new Position(1, kingRow));

  // Left Castle
  if (isKingInPosition && isLeftKnightPositionEmpty && isLeftBishopPositionEmpty && isLeftNewPositionCorrect && castleAvailable) {
    const rook = currBoard.pieces.find((piece) =>
      samePosition(new Position(0, kingRow), piece.position) && piece.castleAvailable
    );

    if (rook) return true;
  }

  const isRightKnightPositionEmpty = !tileIsOccupied(new Position(6, kingRow), currBoard.pieces);
  const isRightBishopPositionEmpty = !tileIsOccupied(new Position(5, kingRow), currBoard.pieces);
  const isQueenPositionEmpty = !tileIsOccupied(new Position(4, kingRow), currBoard.pieces);
  const isRightNewPositionCorrect = samePosition(newPosition, new Position(5, kingRow));

  // Right Castle
  if (isKingInPosition && isRightKnightPositionEmpty && isRightBishopPositionEmpty && isQueenPositionEmpty && isRightNewPositionCorrect && castleAvailable) {
    const rook = currBoard.pieces.find((piece) =>
      samePosition(new Position(7, kingRow), piece.position) && piece.castleAvailable
    );
    if (rook) return true;
  }

  return false;
};

// const promotionTeamType = () => {
//   return (promotionPawn?.teamType === TeamType.WHITE) ? TeamType.WHITE.toLowerCase() : TeamType.BLACK.toLowerCase();
// };

// const promotePawn = (pieceType) => {
//   if (!promotionPawn) return;
//   setBoard((previousBoard) => {
//     board.promotePawn(pieceType, promotionPawn.clone(), board.currentPlayer.teamType);
//     return board.clone();
//   })

//   modalRef.current?.classList.add('hidden');
// };