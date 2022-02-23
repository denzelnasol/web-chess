import React from 'react';

// Styles
import './style.scss';

const Tile = ({ ...props }) => {
  if (props.number % 2 === 0) {
    return (
      <div className='tile black-tile'>
        {props.image && <div style={{ backgroundImage: `url(${props.image})` }} className='chess-piece' />}
      </div>
    );
  } else {
    return (
      <div className='tile white-tile'>
        {props.image && <div style={{ backgroundImage: `url(${props.image})` }} className='chess-piece' />}
      </div>
    );
  }
};

export default Tile;