import React, { useEffect, useRef, useState } from 'react';
import uniqid from 'uniqid';

// Components
import Tile from 'components/Tile/Tile';

// Objects
import Piece from 'objects/Piece';

// Enums
import { PieceType } from 'enums/PieceType';
import { TeamType } from 'enums/TeamType';

// Referee
import Referee from 'referee/Referee';

// Styles
import './style.scss';

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];


const Chessboard = () => {
  
  const chessboardRef = useRef(null);
  
  const [activePiece, setActivePiece] = useState(null);
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [pieces, setPieces] = useState([]);
  
  let board = [];
  
  const referee = new Referee();
  
  useEffect(() => {
    for (let i = 0; i < 2; i++) {
      const teamType = (i === 0) ? TeamType.BLACK : TeamType.WHITE;
      const type = (teamType === TeamType.BLACK) ? 'b' : 'w';
      const y = (teamType === TeamType.BLACK) ? 7 : 0;
      setPieces(pieces => [...pieces, new Piece(`images/${type}-rook.png`, 0, y, PieceType.ROOK, teamType)]);
      setPieces(pieces => [...pieces, new Piece(`images/${type}-rook.png`, 7, y, PieceType.ROOK, teamType)]);
      setPieces(pieces => [...pieces, new Piece(`images/${type}-knight.png`, 1, y, PieceType.KNIGHT, teamType)]);
      setPieces(pieces => [...pieces, new Piece(`images/${type}-knight.png`, 6, y, PieceType.KNIGHT, teamType)]);
      setPieces(pieces => [...pieces, new Piece(`images/${type}-bishop.png`, 2, y, PieceType.BISHOP, teamType)]);
      setPieces(pieces => [...pieces, new Piece(`images/${type}-bishop.png`, 5, y, PieceType.BISHOP, teamType)]);
      setPieces(pieces => [...pieces, new Piece(`images/${type}-king.png`, 3, y, PieceType.KING, teamType)]);
      setPieces(pieces => [...pieces, new Piece(`images/${type}-queen.png`, 4, y, PieceType.QUEEN, teamType)]);
    }

    for (let i = 0; i < 8; i++) {
      setPieces(pieces => [...pieces, new Piece('images/w-pawn.png', i, 1, PieceType.PAWN, TeamType.WHITE)]);
    }

    for (let i = 0; i < 8; i++) {
      setPieces(pieces => [...pieces, new Piece('images/b-pawn.png', i, 6, PieceType.PAWN, TeamType.BLACK)]);
    }
  }, []);

  const grabPiece = (e) => {
    const element = e.target;
    const chessboard = chessboardRef.current;

    if (e.target.classList.contains('chess-piece') && chessboard) {
      const gridX = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
      const gridY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

      setGridX(gridX);
      setGridY(gridY);

      const x = e.clientX - 50;
      const y = e.clientY - 50;

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
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

      
      
      // updates piece position
      setPieces(value => {
        const pieces = value.map(p => {
          if (p.x === gridX && p.y === gridY) {
            // check if valid move
            const validMove = referee.isValidMove(gridX, gridY, x, y, p.type, p.teamType);
            
            if (validMove) {
              p.x = x;
              p.y = y;
            } else {
              activePiece.style.position = 'relative';
              activePiece.style.removeProperty('top');
              activePiece.style.removeProperty('left');
            }
          }
          return p;
        })
        return pieces;
      })
      setActivePiece(null);
    }
  }

  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      const number = j + i + 2;
      let image = undefined;

      pieces.forEach(p => {
        if (p.x === i && p.y === j) {
          image = p.image;
        }
      });

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