import React from 'react';

// Components
import GameManager from 'components/Game/GameManager/GameManager';

// Style
import './App.scss'
import MainPage from 'components/MainPage/MainPage';

function App() {

  return (
    <div className='app'>
      <GameManager />
      {/* <MainPage /> */}
    </div>
  );
}

export default App;
