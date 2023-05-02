import React from "react";

// Styling
import './style.scss';
import Button from "components/Button/Button";

const Home = () => {
  return (
    <div className="home">
      <div className="home-container">
        <div>
          Welcome To Web Chess
        </div>
        <Button buttonStyle="btn--secondary" route="join-or-create">
          Play
        </Button>
      </div>
    </div>
  );
}

export default Home;