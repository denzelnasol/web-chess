import React from "react";
import { useParams } from 'react-router-dom';

// Styling
import './style.scss';

const GameCreation = () => {
  const { id } = useParams();
  return (
    <div className="game-creation">
{`Game ID: ${id}`}
    </div>
  );
}

export default GameCreation;