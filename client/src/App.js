import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// API
import { verifyAccount } from 'api/Account';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const isVerified = await verifyAccount();
      console.log(isVerified);
      setIsLoggedIn(isVerified);
    }

    checkLoggedIn();
  }, []);
  console.log(isLoggedIn)
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
