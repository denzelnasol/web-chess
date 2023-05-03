import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

// API
import { verifyAccount } from "api/Account";

// Components
import Button from "components/Button/Button";

// Styling
import './style.scss';
import Cookies from "js-cookie";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const isVerified = await verifyAccount();
      setIsLoggedIn(isVerified);
    };

    checkLoggedIn();
    showButton();
  }, []);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const signout = () => {
    setIsLoggedIn(false);
    Cookies.remove('session');
    closeMobileMenu();
  }

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            Web Chess <FontAwesomeIcon className="fa-user" icon={faUser} size="1x" />
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            {
              click
                ? <FontAwesomeIcon className="fa-times" icon={faTimes} />
                : <FontAwesomeIcon className="fa-bars" icon={faBars} />
            }
          </div>

          {!isLoggedIn && (
            <>
              <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                <li className="nav-item">
                  <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/info" className="nav-links" onClick={closeMobileMenu}>
                    Info
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/login" className="nav-links" onClick={closeMobileMenu}>
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/sign-up" className="nav-links-mobile" onClick={closeMobileMenu}>
                    Sign Up
                  </Link>
                </li>

              </ul>

              {button &&
                <Button buttonStyle="btn--outline" route="sign-up">
                  SIGN UP
                </Button>}
            </>
          )}

          {isLoggedIn && (
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-links" onClick={closeMobileMenu}>
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/login" className="nav-links" onClick={signout}>
                  Sign Out
                </Link>
              </li>
            </ul>
          )}

        </div>
      </nav >
    </>
  );
}

export default Navbar;