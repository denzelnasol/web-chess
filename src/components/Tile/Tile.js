import React from 'react';

// Styles
import './style.scss';

const Tile = ({ ...props }) => {
  const className = ['tile',
    props.number % 2 === 0 && 'black-tile',
    props.number % 2 !== 0 && 'white-tile',
    props.enemyHighlight && 'tile-enemy-highlight',
    props.highlight && !props.enemyHighlight && 'tile-highlight'
  ].filter(Boolean).join(' ');

  return (
    <div className={className}>
      {props.image && <div style={{ backgroundImage: `url(${props.image})` }} className='chess-piece' />}
    </div>
  );
};

export default Tile;