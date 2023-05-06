import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';

// import { socket as mainSocket } from "socket/socket";
import io from 'socket.io-client';

// API
import { getGame } from "api/Game";

// Constants
import { HORIZONTAL_AXIS, VERTICAL_AXIS, initialBoard } from "constants/Constants";

// Components
import GameManager from "components/Game/GameManager/GameManager";

// Styling
import './style.scss';
import Position from "models/Position";
import { getSessionAccount } from "api/Account";

const Lobby = () => {
  let { id } = useParams();
  id = id.substring(1);

  const boardRef = useRef(undefined);
  const notationRef = useRef(undefined);

  const [game, setGame] = useState(undefined);
  const [board, setBoard] = useState(undefined);
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(undefined);
  const [notation, setNotation] = useState(undefined);

  useEffect(() => {
    const mainSocket = io('http://localhost:8080/game');

    const setupBoard = async () => {
      const game = await getGame(id)
      setGame(game);
      let board = initialBoard.clone();
      if (game.notation && game.notation.length !== 0) {
        const notations = game.notation.split(' ');
        for (const notation of notations) {
          parseMove(notation, board);
        }
        setNotation(game.notation);
      }
      setBoard(board);
    }

    const setupSocket = async () => {
      const account = await getSessionAccount();
      // const board = await setupBoard();
      const onConnectData = {
        account,
        gameId: id,
      }

      mainSocket.on("connect", () => {
        console.log(`Connected to lobby for game ${id}`);
        mainSocket.emit("joinGame", onConnectData);
      });

      mainSocket.on("players", (playerList) => {
        setPlayers(playerList);
      });

      mainSocket.on('playMove', onMove);
      setSocket(mainSocket);
    };

    setupBoard();
    setupSocket();

    return () => {
      if (mainSocket) {
        mainSocket.disconnect();
      }
    }
  }, []);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    notationRef.current = notation;
  }, [notation]);

  const onMove = (move) => {
    const combinedNotation = notationRef.current ? notationRef.current.concat(" ", move) : move; 
    setNotation(combinedNotation);
    parseMove(move, boardRef.current);
  }

  const parseMove = (notation, board) => {
    if (!notation || !board) return;
    const startAndEndPositions = notation.split('->');
    const startPosition = startAndEndPositions[0];
    let endPosition = startAndEndPositions[1];
    endPosition = endPosition.replace(/[xO\-+#A-Z]/g, "");

    const startHorizontalIndex = HORIZONTAL_AXIS.indexOf(startPosition[0]);
    const startVerticalIndex = VERTICAL_AXIS.indexOf(startPosition[1]);

    const startPos = new Position(startHorizontalIndex, startVerticalIndex);

    const endHorizontalIndex = HORIZONTAL_AXIS.indexOf(endPosition[0]);
    const endVerticalIndex = VERTICAL_AXIS.indexOf(endPosition[1]);

    const endPos = new Position(endHorizontalIndex, endVerticalIndex);

    board.movePiece(startPos, endPos);
    setBoard(board.clone());
  };

  const emitMove = (move) => {
    socket.emit('playMove', move);
  }

  return (
    <div className="game-creation">
      <h2>Game Lobby</h2>
      <p>Players in lobby: {players.length}</p>
      {players && (
        <ul>
          {players.map((player) => (
            <li key={player.email}>{player.email}</li>
          ))}
        </ul>
      )}
      {/* {game && board && */}
      <GameManager
        gameId={id}
        board={board}
        notation={notation}
        emitMove={emitMove}
      />
      {/* } */}
    </div>
  );
}

export default Lobby;