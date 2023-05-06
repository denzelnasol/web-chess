import { Server } from 'socket.io';

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
    socket.on('joinGame', (data) => {
      const email = data?.account?.email ?? "unknown email";
      console.log(`Socket ${socket.id} with email ${email} joined game ${data.gameId}`);
      socket.join(`game_${data.gameId}`);
      socket.gameId = data.gameId;

      playerMap[socket.id] = email;

      const room = gameNamespace.adapter.rooms.get(`game_${data.gameId}`);
      const players = [...room].map((socketId) => {
        return {
          id: socketId,
          email: playerMap[socketId],
        };
      });
      gameNamespace.to(`game_${data.gameId}`).emit("players", players);
    });

    // Handle leaving a game
    socket.on('disconnect', () => {
      const gameId = socket.gameId;
      const leavingPlayer = socket.id;

      // Remove leaving user from player list
      const room = gameNamespace.adapter.rooms.get(`game_${gameId}`);
      if (room && room !== undefined) {
        const remainingPlayers = [...room].filter((socketId) => socketId !== leavingPlayer);
        const updatedPlayers = remainingPlayers.map((socketId) => {
          return {
            id: socketId,
            email: playerMap[socketId],
          };
        });
  
        gameNamespace.to(`game_${gameId}`).emit("players", updatedPlayers);
      }
      console.log(`Socket ${socket.id} disconnected from game ${gameId}`);
    });

    // Handle move in a game
    socket.on('move', (gameId, move) => {
      console.log(`Socket ${socket.id} sent move ${move} for game ${gameId}`);
      // Broadcast the move to other players in the game
      socket.to(`game_${gameId}`).emit('move', move);
    });
  });


  return io;
}

export {
  initializeSocket,
}