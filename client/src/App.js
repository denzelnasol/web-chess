import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Components
import GameManager from 'components/Game/GameManager/GameManager';
import Home from 'components/Home/Home';
import Navbar from 'components/Navbar/Navbar';
import SignUp from 'components/SignUp/SignUp';
import Login from 'components/Login/Login';
import Info from 'components/Info/Info';
import Dashboard from 'components/Dashboard/Dashboard';
import Private from 'components/Private/Private';

// Style
import './App.scss'

function App() {

  return (
    <div className='app'>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GameManager />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/info" element={<Info />} />

        {/* Login restricted routes */}
        <Route path='/dashboard' element={<Private componentToRender={Dashboard} />} />
      </Routes>
    </div>
  );
}

export default App;
