import React from "react";

// Styling
import './style.scss';
import { Link } from "react-router-dom";

const STYLES = [
  'btn--primary',
  'btn--secondary',
  'btn--outline'
];

const SIZES = [
  'btn--small',
  'btn--medium',
  'btn--large'
];

const Button = ({ ...props }) => {

  const checkButtonStyle = STYLES.includes(props.buttonStyle)
    ? props.buttonStyle
    : STYLES[0];

  const checkButtonSize = SIZES.includes(props.buttonSize)
    ? props.buttonSize
    : SIZES[0];

  const button = (
    <button
      className={`${props.className} button ${checkButtonStyle} ${checkButtonSize}`}
      onClick={props.onClick}
      type={props.type}
    >
      {props.children}
    </button>
  );

  return props.noLink ? button : (
    <Link to={`/${props.route}`} className="btn-mobile">
      {button}
    </Link>
  );
}

export default Button;