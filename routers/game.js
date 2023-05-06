import express from "express";
import pkg from "pg";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { findAccountByEmail } from "../services/account.js";
import { createGame, getGame, updateMoveHistory } from "../services/game.js";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgres://denzelnasol@localhost:5432/web_chess',
});


const gameRouter = express.Router();
gameRouter.use(cookieParser());

gameRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const game = await getGame(id);
  res.json(game);
});

gameRouter.get('/', (req, res) => {
  pool.query('SELECT * FROM game', (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error retrieving games');
    } else {
      res.json(result.rows);
    }
  });
});

gameRouter.post('/create', async (req, res) => {
  const sessionCookie = req.cookies.session;

  if (!sessionCookie) {
    res.status(401).send('Authentication failure');
    return;
  }

  const decodedSessionCookie = jwt.decode(sessionCookie);
  const email = decodedSessionCookie.email;
  const account = await findAccountByEmail(email);
  if (!account) {
    res.status(401).send('Authentication failure');
    res.end();
  }

  const game = await createGame(account.id);
  res.json(game);
});

gameRouter.post('/', async (req, res) => {
  const sessionCookie = req.cookies.session;
  const { gameId, moveHistory } = req.body;

  if (!sessionCookie) {
    res.status(401).send('Authentication failure');
    return;
  }

  const decodedSessionCookie = jwt.decode(sessionCookie);
  const email = decodedSessionCookie.email;
  const account = await findAccountByEmail(email);
  if (!account) {
    res.status(401).send('Authentication failure');
    res.end();
  }

  const game = await updateMoveHistory(gameId, moveHistory)
  res.json(game);
});

export default gameRouter;