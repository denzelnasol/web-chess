import React, { useEffect, useRef, useState } from 'react';

// Components
import Tile from 'components/Tile/Tile';

// Objects
import Piece from 'objects/Piece';
import Position from 'objects/Position';

// Enums
import { PieceType } from 'enums/PieceType';
import { TeamType } from 'enums/TeamType';

// Constants
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE } from 'constants/Constants';

// Referee
import Referee from 'referee/Referee';

// Rules
import { isEnPassantMove } from 'referee/Rules/PawnRules';

// Utilities
import { samePosition } from 'utilities/Position';

// Styles
import './style.scss';

const Chessboard = () => {

  const chessboardRef = useRef(null);

  const [activePiece, setActivePiece] = useState(null);
  const [grabPosition, setGrabPosition] = useState(new Position(-1, -1));
  const [pieces, setPieces] = useState([]);

  let board = [];

  const referee = new Referee();

  useEffect(() => {
    for (let i = 0; i < 2; i++) {
      const teamType = (i === 0) ? TeamType.BLACK : TeamType.WHITE;
      const type = (teamType === TeamType.BLACK) ? 'b' : 'w';
      const y = (teamType === TeamType.BLACK) ? 7 : 0;
      setPieces(pieces => [...pieces, new Piece(`images/${type}-rook.png`, new Position(0, y), PieceType.ROOK, teamType)]);
      setPieces(pieces => [...pieces, new Piece(`images/${type}-rook.png`, new Position(7, y), PieceType.ROOK, teamType)]);
      setPieces(pieces => [...pieces, new Piece(`images/${type}-knight.png`, new Position(1, y), PieceType.KNIGHT, teamType)]);
      setPieces(pieces => [...pieces, new Piece(`images/${type}-knight.png`, new Position(6, y), PieceType.KNIGHT, teamType)]);
      setPieces(pieces => [...pieces, new Piece(`images/${type}-bishop.png`, new Position(2, y), PieceType.BISHOP, teamType)]);
      setPieces(pieces => [...pieces, new Piece(`images/${type}-bishop.png`, new Position(5, y), PieceType.BISHOP, teamType)]);
      setPieces(pieces => [...pieces, new Piece(`images/${type}-king.png`, new Position(3, y), PieceType.KING, teamType)]);
      setPieces(pieces => [...pieces, new Piece(`images/${type}-queen.png`, new Position(4, y), PieceType.QUEEN, teamType)]);
    }

    for (let i = 0; i < 8; i++) {
      setPieces(pieces => [...pieces, new Piece('images/w-pawn.png', new Position(i, 1), PieceType.PAWN, TeamType.WHITE)]);
    }

    for (let i = 0; i < 8; i++) {
      setPieces(pieces => [...pieces, new Piece('images/b-pawn.png', new Position(i, 6), PieceType.PAWN, TeamType.BLACK)]);
    }
  }, []);

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

  const movePiece = (e) => {
    const chessboard = chessboardRef.current;

    if (activePiece && chessboard) {
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
  }

  const dropPiece = (e) => {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
      const currentPiece = pieces.find((p) => samePosition(p.position, grabPosition));

      if (currentPiece) {
        const validMove = referee.isValidMove(grabPosition, new Position(x, y), currentPiece.type, currentPiece.teamType, pieces);

        const isEnPassantMove_ = isEnPassantMove(grabPosition, new Position(x, y), pieces, currentPiece.type, currentPiece.teamType, pieces);

        const pawnDirection = currentPiece.teamType === TeamType.WHITE ? 1 : -1;
        if (isEnPassantMove_) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (piece.position.x === grabPosition.x && piece.position.y === grabPosition.y) {
              piece.enPassant = false;
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (!samePosition(piece.position, new Position(x, y - pawnDirection))) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }
            return results;
          }, []);

          setPieces(updatedPieces);

        } else if (validMove) {
          // updates piece position, if piece attacked, remove it
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              piece.enPassant = Math.abs(grabPosition.y - y) === 2 && piece.type === PieceType.PAWN;
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (!samePosition(piece.position, new Position(x, y))) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }

            return results;
          }, []);

          setPieces(updatedPieces);
        } else {
          // resets piece position
          activePiece.style.position = 'relative';
          activePiece.style.removeProperty('top');
          activePiece.style.removeProperty('left');
        }
      }

      setActivePiece(null);
    }
  }

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const piece = pieces.find((piece) => (samePosition(piece.position, new Position(i, j))));

      let image = undefined;
      if (piece) {
        image = piece.image;
      }

      board.push(<Tile key={`${j},${i}`} number={number} image={image} />);
    }
  }

  return (
    <div
      className='chessboard'
      ref={chessboardRef}
      onMouseMove={e => movePiece(e)}
      onMouseDown={e => grabPiece(e)}
      onMouseUp={e => dropPiece(e)}
    >
      {board}
    </div>
  )
};

export default Chessboard;