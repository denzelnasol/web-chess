import React from "react";

// Components
import Button from "components/Button/Button";

// Styling
import './style.scss';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <img src="images/board.png" alt="A chessboard" width="500" height="500" />
      <Button buttonStyle="btn--secondary" route="join-or-create" className="play-button">
        Play A Game
      </Button>
      <div>
      </div>
    </div>
  );
}

export default Dashboard;