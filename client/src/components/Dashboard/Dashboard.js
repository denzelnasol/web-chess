import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Button from "components/Button/Button";

// Styling
import './style.scss';
import { createGame } from "api/Game";
import Lobby from "./Lobby";

const Dashboard = () => {
  const navigate = useNavigate();

  const [showGameCreation, setShowGameCreation] = useState(false);

  const generateGame = async () => {
    const game = await createGame();
    const gameId = game.id;
    navigate(`/game/:${gameId}`);
  }

  return (
    <div className="dashboard">
      <img src="images/board.png" alt="A chessboard" width="500" height="500" />
      <Button
        buttonStyle="btn--secondary"
        className="play-button"
        onClick={generateGame}
      >
        Play A Game
      </Button>

      {showGameCreation && <Lobby />}
    </div>
  );
}

export default Dashboard;