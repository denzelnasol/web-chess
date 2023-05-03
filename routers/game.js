import express from "express";
import pkg from "pg";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { findAccountByEmail } from "../services/account.js";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgres://denzelnasol@localhost:5432/web_chess',
});


const gameRouter = express.Router();
gameRouter.use(cookieParser());

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
  console.log(email)
  const account = await findAccountByEmail(email);
  if (!account) {
    res.status(401).send('Authentication failure');
  } else {
    console.log(account)
  }
});

export default gameRouter;