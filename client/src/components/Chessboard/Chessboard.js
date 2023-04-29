import React, { useRef, useState } from 'react';

// Models
import Position from 'models/Position';

// Components
import Tile from 'components/Tile/Tile';

// Constants
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE } from 'constants/Constants';

// Rules
import { tileIsOccupiedByOpponent } from 'Rules/GeneralRules';

// Utilities
import { samePosition } from 'utilities/Position';

// Styles
import './style.scss';

/**
 * @description Renders a chess board and updates the render on legal moves
 * @param {Array} pieces - List of Piece objects which contain information on its team, current position, and possible moves
 * @param {Function} playMove - Function which returns a boolean on the legality of a move. If true, re-render to update the board view
 *
 * @returns
 *
 * @example
 * <Chessboard playMove={playMove} pieces={board.pieces} playComputerMove={playComputerMove} />
 */
function Chessboard({ ...props }) {

  // ** useRefs ** //
  const chessboardRef = useRef(null);

  // ** useStates ** //
  const [activePiece, setActivePiece] = useState(null);
  const [grabPosition, setGrabPosition] = useState(new Position(-1, -1));

  // ** Functions ** //
  const grabPiece = (e) => {
    const element = e.target;
    const chessboard = chessboardRef.current;
    if (e.target.classList.contains('chess-piece') && chessboard) {
      const grabPositionX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabPositionY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

      setGrabPosition(new Position(grabPositionX, grabPositionY));

      const x = e.clientX - (GRID_SIZE / 2);
      const y = e.clientY - (GRID_SIZE / 2);

      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`

      setActivePiece(element);
    }
  }

  // Allows the dragging of a grabbed piece across the screen
  const movePiece = (e) => {
    const chessboard = chessboardRef.current;
    if (!activePiece || !chessboard) return;
    const minX = chessboard.offsetLeft - 25;
    const minY = chessboard.offsetTop - 25;
    const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
    const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
    const x = e.clientX - 50;
    const y = e.clientY - 50;
    activePiece.style.position = "absolute";

    if (x < minX) {
      activePiece.style.left = `${minX}px`;
    } else if (x > maxX) {
      activePiece.style.left = `${maxX}px`;
    } else {
      activePiece.style.left = `${x}px`;
    }

    if (y < minY) {
      activePiece.style.top = `${minY}px`;
    } else if (y > maxY) {
      activePiece.style.top = `${maxY}px`;
    } else {
      activePiece.style.top = `${y}px`;
    }
  }

  const dropPiece = (e) => {
    const chessboard = chessboardRef.current;
    if (!activePiece || !chessboard) return;

    const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
    const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));

    const currentPiece = props.pieces.find((p) => samePosition(p.position, grabPosition));
    if (!currentPiece) {
      setActivePiece(null);
      return;
    }

    const success = props.playMove(currentPiece.clone(), new Position(x, y));
    if (!success) {
      // Reset the piece position
      activePiece.style.position = 'relative';
      activePiece.style.removeProperty('top');
      activePiece.style.removeProperty('left');
    }

    setActivePiece(null);
  }

  let board = [];

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const piece = props.pieces.find((piece) => (samePosition(piece.position, new Position(i, j))));
      const image = piece ? piece.image : undefined;
      const currentPiece = activePiece !== null ? props.pieces.find((piece) => samePosition(piece.position, grabPosition)) : undefined;
      const highlight = currentPiece?.possibleMoves ? (
        currentPiece.possibleMoves.some((piece) => samePosition(piece, new Position(i, j)))
      ) && !currentPiece.isImmovable : false;

      const enemyHighlight = currentPiece?.possibleMoves ? (
        currentPiece.possibleMoves.some((piece) => samePosition(piece, new Position(i, j))) && tileIsOccupiedByOpponent(new Position(i, j), props.pieces, currentPiece.teamType)
      ) && !currentPiece.isImmovable : false;

      board.push(<Tile key={`${j},${i}`} number={number} image={image} highlight={highlight} enemyHighlight={enemyHighlight} />);
    }
  }

  return (
    <>
      <div
        className='chessboard'
        ref={chessboardRef}
        onMouseMove={e => movePiece(e)}
        onMouseDown={e => grabPiece(e)}
        onMouseUp={e => dropPiece(e)}
      >
        {board}
      </div>
      <button onClick={() => props.unplayMove()}>Undo</button>
    </>
  );
}

export default Chessboard;