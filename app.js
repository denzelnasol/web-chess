import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';

// Environment Variables
import * as dotenv from 'dotenv';
dotenv.config();

// Routers
import accountRouter from "./routers/account.js";
import gameRouter from "./routers/game.js";
import emailRouter from "./routers/email.js";

// Socket
import { createServer } from 'http';
import { initializeSocket } from "./socket.js";

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const apiRouter = express.Router();
apiRouter.use('/account', accountRouter);
apiRouter.use('/game', gameRouter);
apiRouter.use('/email', emailRouter);
app.use('/api', apiRouter);

const PORT = 8080;
const server = createServer(app);
const io = initializeSocket(server);
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

