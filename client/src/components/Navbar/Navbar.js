import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

// Components
import Button from "components/Button/Button";

// Styling
import './style.scss';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    showButton();
  }, []);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

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

        </div>
      </nav>
    </>
  );
}

export default Navbar;