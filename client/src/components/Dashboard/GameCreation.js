import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

// API
import { getGame } from "api/Game";

// Constants
import { HORIZONTAL_AXIS, VERTICAL_AXIS, initialBoard } from "constants/Constants";

// Components
import GameManager from "components/Game/GameManager/GameManager";

// Styling
import './style.scss';
import Position from "models/Position";

const GameCreation = () => {
  const { id } = useParams();
  const cleanedId = id.substring(1);

  const [game, setGame] = useState(undefined);
  const [board, setBoard] = useState(undefined);

  useEffect(() => {
    const setupGame = async () => {
      const game = await getGame(cleanedId)
      setGame(game);

      if (!game.notation || game.notation.length === 0) return;
      const notations = game.notation.split(' ');

      const board = initialBoard.clone();
      notations.forEach(notation => {
        parseMove(notation, board);
      });

      setBoard(board);
    }

    setupGame();
  }, []);

  const parseMove = (notation, board) => {
    if (!notation) return;
    const startAndEndPositions = notation.split('->');
    const startPosition = startAndEndPositions[0];
    let endPosition = startAndEndPositions[1];
    endPosition = endPosition.replace(/[xO\-+#]/g, "");

    const startHorizontalIndex = HORIZONTAL_AXIS.indexOf(startPosition[0]);
    const startVerticalIndex = VERTICAL_AXIS.indexOf(startPosition[1]);

    const startPos = new Position(startHorizontalIndex, startVerticalIndex);

    const endHorizontalIndex = HORIZONTAL_AXIS.indexOf(endPosition[0]);
    const endVerticalIndex = VERTICAL_AXIS.indexOf(endPosition[1]);

    const endPos = new Position(endHorizontalIndex, endVerticalIndex);

    board.movePiece(startPos, endPos);
  };

  return (
    <div className="game-creation">
      <GameManager gameId={cleanedId} board={board} notation={game && game.notation} />
    </div>
  );
}

export default GameCreation;