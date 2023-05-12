import { Server } from 'socket.io';
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgres://denzelnasol@localhost:5432/web_chess',
});

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });

  // Game namespace
  const gameNamespace = io.of('/game');
  const playerMap = {};
  gameNamespace.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected to game namespace`);

    // Handle joining a game
    socket.on('joinGame', async (data) => {
      try {
        const accountEmail = data?.account?.email ?? "unknown email";
        const accountId = data?.account?.id;

        socket.join(`game_${data.gameId}`);
        socket.gameId = data.gameId;
        console.log(`Socket ${socket.id} with email ${accountEmail} joined game ${data.gameId}`);

        const room = gameNamespace.adapter.rooms.get(`game_${data.gameId}`);

        const query = 'SELECT owner_id, black_player_id, white_player_id FROM game WHERE id = $1';
        const { rows } = await pool.query(query, [data.gameId]);
        const { owner_id, black_player_id, white_player_id } = rows[0];

        if (owner_id === accountId) {
          playerMap[socket.id] = {
            id: accountId,
            email: accountEmail,
            color: white_player_id === owner_id ? 'white' : 'black',

          };
        } else {
          playerMap[socket.id] = {
            id: accountId,
            email: accountEmail,
            color: white_player_id === owner_id ? 'black' : 'white',
          };
        }

        const color = playerMap[socket.id].color;

        // Update the game with the new player
        const updateQuery = `UPDATE game SET ${color}_player_id = $1 WHERE id = $2`;
        await pool.query(updateQuery, [accountId, data.gameId]);

        const players = [...room].map((socketId) => {
          return {
            id: playerMap[socketId].id,
            email: playerMap[socketId].email,
            color: playerMap[socketId].color,
          };
        });
        gameNamespace.to(`game_${data.gameId}`).emit("players", players);
      } catch (e) {
        console.log(e);
      }
    });

    // Handle leaving a game
    socket.on('disconnect', () => {
      const gameId = socket.gameId;
      const leavingPlayer = socket.id;

      // Remove leaving user from player list
      const room = gameNamespace.adapter.rooms.get(`game_${gameId}`);
      if (room) {
        const remainingPlayers = [...room].filter((socketId) => socketId !== leavingPlayer);
        const updatedPlayers = remainingPlayers.map((socketId) => {
          return {
            id: playerMap[socketId].id,
            email: playerMap[socketId].email,
            color: playerMap[socketId].color,
          };
        });

        gameNamespace.to(`game_${gameId}`).emit("players", updatedPlayers);
      }
      console.log(`Socket ${socket.id} disconnected from game ${gameId}`);
    });

    // Handle move in a game
    socket.on('playMove', (move) => {
      console.log(`Socket ${socket.id} sent move ${move} for game ${socket.gameId}`);
      // Broadcast the move to other players in the game
      socket.broadcast.to(`game_${socket.gameId}`).emit('playMove', move);
    });

    socket.on('pawnPromotion', (data) => {
      console.log(`Socket ${socket.id} sent pawn promotion data for game ${socket.gameId}`);
      // Broadcast pawn promotion data to other players in the game
      socket.broadcast.to(`game_${socket.gameId}`).emit('pawnPromotion', data);
    })
  });


  return io;
}

export {
  initializeSocket,
}