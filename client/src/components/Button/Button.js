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

  return (
    <Link to={`/${props.route}`} className="btn-mobile">
      <button
        className={`button ${checkButtonStyle} ${checkButtonSize}`}
        onClick={props.onClick}
        type={props.type}
      >
        {props.children}
      </button>
    </Link>
  );
}

export default Button;