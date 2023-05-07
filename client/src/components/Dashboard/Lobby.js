import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';

// import { socket as mainSocket } from "socket/socket";
import io from 'socket.io-client';

// API
import { getGame } from "api/Game";
import { getSessionAccount } from "api/Account";

// Constants
import { HORIZONTAL_AXIS, VERTICAL_AXIS, initialBoard } from "constants/Constants";

// Components
import GameManager from "components/Game/GameManager/GameManager";

// Styling
import './style.scss';

const Lobby = () => {
  let { id } = useParams();
  id = id.substring(1);

  const boardRef = useRef(undefined);
  const notationRef = useRef(undefined);

  const [board, setBoard] = useState(initialBoard.clone());
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(undefined);
  const [notation, setNotation] = useState(undefined);

  useEffect(() => {
    const mainSocket = io('http://localhost:8080/game');

    const setupGame = async () => {
      const game = await getGame(id);
      setNotation(game.notation);
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

    setupGame();
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
  }

  const updateBoard = () => {
    setBoard((previousBoard) => {
      return board.clone();
    })
  }

  const updateNotation = (notationMove) => {
    if (notation) {
      const updatedNotation = notation.concat(" ", notationMove);
      setNotation(updatedNotation);
    } else {
      setNotation(notationMove);
    }
  }

  const emitMove = (move) => {
    try {
      socket.emit('playMove', move);
    } catch (e) {
      console.log('Socket does not exist')
    }
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
        updateBoard={updateBoard}
        notation={notation}
        emitMove={emitMove}
        updateNotation={updateNotation}
      />
      {/* } */}
    </div>
  );
}

export default Lobby;