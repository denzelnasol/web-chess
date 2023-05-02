import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components
import GameManager from 'components/Game/GameManager/GameManager';
import Home from 'components/Home/Home';
import Navbar from 'components/Navbar/Navbar';
import SignUp from 'components/SignUp/SignUp';

// Style
import './App.scss'

function App() {

  return (
    <div className='app'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GameManager />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
