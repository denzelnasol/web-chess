import React, { useState, useEffect } from "react";
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

  const [game, setGame] = useState(undefined);
  const [board, setBoard] = useState(undefined);
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    const mainSocket = io('http://localhost:8080/game');

    const setupBoard = async () => {
      const game = await getGame(id)
      setGame(game);

      let board = initialBoard.clone();
      if (game.notation && game.notation.length !== 0) {
        const notations = game.notation.split(' ');
        notations.forEach(notation => {
          parseMove(notation, board);
        });
      }

      setBoard(board);
    }

    const setupSocket = async () => {
      const account = await getSessionAccount();
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

      setSocket(mainSocket);
    };

    setupBoard();
    setupSocket();
  }, []);

  const parseMove = (notation, board) => {
    if (!notation) return;
    const startAndEndPositions = notation.split('->');
    const startPosition = startAndEndPositions[0];
    let endPosition = startAndEndPositions[1];
    endPosition = endPosition.replace(/[xO\-+#]/g, "");

    const startHorizontalIndex = HORIZONTAL_AXIS.indexOf(startPosition[0]);
    const startVerticalIndex = VERTICAL_AXIS.indexOf(startPosition[1]);

    const startPos = new Position(startHorizontalIndex, startVerticalIndex);

    const endHorizontalIndex = HORIZONTAL_AXIS.indexOf(endPosition[0]);
    const endVerticalIndex = VERTICAL_AXIS.indexOf(endPosition[1]);

    const endPos = new Position(endHorizontalIndex, endVerticalIndex);

    board.movePiece(startPos, endPos);
  };

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
      <GameManager gameId={id} board={board} notation={game && game.notation} />
      {/* } */}
    </div>
  );
}

export default Lobby;