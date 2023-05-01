import React from 'react';

// Styles
import './style.scss';

/**
 * @description Renders a chess board and updates the render on legal moves
 * @param {Number} number - Whether to render a black tile (number % 2 === 0) or white tile (number % 2 !== 0)
 * @param {Boolean} enemyHighlight - Highlight a tile as occupied by an enemy and able to be captured
 * @param {Boolean} highlight - Highlight a tile as a possible move
 * @param {String} image - the url of a Piece's image to be rendered on the tile
 *
 * @returns
 *
 * @example
 * <Tile key={key} number={number} image={image} highlight={highlight} enemyHighlight={enemyHighlight} />
 */
const Tile = ({ ...props }) => {
  const className = ['tile',
    props.number % 2 === 0 ? 'black-tile' : 'white-tile',
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