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
import Button from "components/Button/Button";
import InviteDialog from "components/InviteDialog/InviteDialog";

// Styling
import './style.scss';
import Position from "models/Position";
import { samePosition } from "utilities/Position";

const Lobby = () => {
  let { id } = useParams();
  id = id.substring(1);

  const notationRef = useRef(undefined);
  const boardRef = useRef(undefined);

  const [board, setBoard] = useState(initialBoard.clone());
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(undefined);
  const [notation, setNotation] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  useEffect(() => {
    const mainSocket = io('http://localhost:8080/game');

    const setupGame = async () => {
      const game = await getGame(id);
      setNotation(game.notation);
    }

    const setupSocket = async () => {
      const account = await getSessionAccount();
      setAccount(account);

      mainSocket.on("connect", onSocketJoinGame);
      mainSocket.on("players", (playerList) => {
        setPlayers(playerList);
      });

      mainSocket.on('playMove', onSocketPlayMove);
      mainSocket.on('pawnPromotion', onSocketPawnPromotion);
      setSocket(mainSocket);
    };
    
    setupGame();
    setupSocket();

    return () => {
      if (mainSocket) mainSocket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    onSocketJoinGame();
  }, [socket]);

  useEffect(() => {
    notationRef.current = notation;
  }, [notation]);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  const onSocketPlayMove = (move) => {
    console.log('SOCKET TRIGGERD BY:', move)
    const combinedNotation = notationRef.current ? notationRef.current.concat(" ", move) : move;
    setNotation(combinedNotation);
  }

  const onSocketJoinGame = () => {
    if (!socket) return;
    console.log(`Connected to lobby for game ${id}`);
    socket.emit("joinGame",
      {
        account,
        gameId: id
      });
  }
  // console.log(notation)
  console.log(board);
  const onSocketPawnPromotion = (data) => {
    const pawnPosition = new Position(data.position.x, data.position.y);
    const pawn = boardRef.current.pieces.find((piece) => samePosition(pawnPosition, piece.position));
    boardRef.current.promotePawn(data.type, pawn.clone(), boardRef.current.currentPlayer.teamType);
    updateNotation(data.promotionNotation);
    setBoard(boardRef.current.clone());
  }

  const updateBoard = () => {
    setBoard(board.clone());
  }

  const updateNotation = (notationMove, pawnPromotionNotation) => {
    if (pawnPromotionNotation) {
      const updatedNotation = notation.concat(pawnPromotionNotation);
      setNotation(updatedNotation);
    } else {
      if (notation) {
        const updatedNotation = notation.concat(" ", notationMove);
        setNotation(updatedNotation);
      } else {
        setNotation(notationMove);
      }
    }
  }

  const emitMove = (move) => {
    try {
      socket.emit('playMove', move);
    } catch (e) {
      console.log('Socket does not exist')
    }
  }

  const emitPawnPromotion = (data) => {
    try {
      socket.emit('pawnPromotion', data);
    } catch (e) {
      console.log('Socket Error: Socket does not exist');
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
        className="invite-button"
        buttonStyle="btn--secondary"
        buttonSize="btn--small"
        onClick={() => setIsInviteDialogOpen(!isInviteDialogOpen)}
        noLink={true}
      >
        Send Invite
      </Button>
    </div>
  );

  const gameManager = (
    <div className="game-board">
      <InviteDialog
        isInviteDialogOpen={isInviteDialogOpen}
        updateInviteDialog={() => setIsInviteDialogOpen(!isInviteDialogOpen)}
      />
      {board &&
        <GameManager
          gameId={id}
          board={board}
          updateBoard={updateBoard}
          notation={notation}
          emitMove={emitMove}
          emitPawnPromotion={emitPawnPromotion}
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