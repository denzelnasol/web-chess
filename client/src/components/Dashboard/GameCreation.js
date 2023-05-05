import React from "react";
import { useParams } from 'react-router-dom';

import GameManager from "components/Game/GameManager/GameManager";

// Styling
import './style.scss';

const GameCreation = () => {
  const { id } = useParams();
  const cleanedId = id.substring(1);
  return (
    <div className="game-creation">
      <GameManager gameId={cleanedId} />
    </div>
  );
}

export default GameCreation;