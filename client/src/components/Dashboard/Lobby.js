import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';

import io from 'socket.io-client';

// API
import { getGame } from "api/Game";
import { getSessionAccount } from "api/Account";

// Constants
import { initialBoard } from "constants/Constants";

// Components
import GameManager from "components/Game/GameManager/GameManager";

// Styling
import './style.scss';
import Button from "components/Button/Button";

const Lobby = () => {
  let { id } = useParams();
  id = id.substring(1);

  const notationRef = useRef(undefined);

  const [board, setBoard] = useState(initialBoard.clone());
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(undefined);
  const [notation, setNotation] = useState(undefined);
  const [account, setAccount] = useState(undefined);

  useEffect(() => {
    const mainSocket = io('http://localhost:8080/game');

    const setupGame = async () => {
      const game = await getGame(id);
      setNotation(game.notation);
    }

    const setupSocket = async () => {
      const account = await getSessionAccount();
      const onConnectData = {
        account,
        gameId: id,
      }

      setAccount(account);

      mainSocket.on("connect", () => {
        console.log(`Connected to lobby for game ${id}`);
        mainSocket.emit("joinGame", onConnectData);
      });

      mainSocket.on("players", (playerList) => {
        setPlayers(playerList);
      });

      mainSocket.on('playMove', onSocketPlayMove);
      setSocket(mainSocket);
    };

    setupGame();
    setupSocket();

    return () => {
      if (mainSocket) mainSocket.disconnect();
    }
  }, []);

  useEffect(() => {
    notationRef.current = notation;
  }, [notation]);

  const onSocketPlayMove = (move) => {
    const combinedNotation = notationRef.current ? notationRef.current.concat(" ", move) : move;
    setNotation(combinedNotation);
  }

  const updateBoard = () => {
    setBoard(board.clone());
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


  const gameInfo = (
    <div className="game-info">
      <h2>Game Lobby</h2>
      <p>Players in lobby: {players.length}</p>
      {players && (
        <ul>
          {players.map((player) => (
            player && player.email &&
            <li key={player.email}>
              {player.email} ({player.color})
            </li>
          ))}
        </ul>
      )}

      <Button
        className = "invite-button"
        buttonStyle = "btn--secondary"
        buttonSize = "btn--small"
        noLink = {true}
      >
        Send Invite
      </Button>
    </div>
  );

  const gameManager = (
    <div className="game-board">
      {board &&
        <GameManager
          gameId={id}
          board={board}
          updateBoard={updateBoard}
          notation={notation}
          emitMove={emitMove}
          updateNotation={updateNotation}
          players={players}
          account={account}
        />
      }
    </div>
  );

  return (
    <div className="game-creation">
      {gameInfo}
      {gameManager}
    </div>
  );
}

export default Lobby;