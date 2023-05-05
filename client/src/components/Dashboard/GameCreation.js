import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import GameManager from "components/Game/GameManager/GameManager";

// Styling
import './style.scss';
import { getGame } from "api/Game";

const GameCreation = () => {
  const { id } = useParams();
  const cleanedId = id.substring(1);

  const [game, setGame] = useState(undefined);

  useEffect(() => {
    const findGame = async () => {
      const game = await getGame(cleanedId)
      setGame(game);
    }

    findGame();
  }, []);

  console.log(game);

  return (
    <div className="game-creation">
      <GameManager gameId={cleanedId} />
    </div>
  );
}

export default GameCreation;