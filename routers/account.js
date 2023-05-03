import express from "express";
import pkg from "pg";
import { addAccount, findUserByEmail, loginAccount } from "../services/account.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgres://denzelnasol@localhost:5432/web_chess',
});


const accountRouter = express.Router();
accountRouter.use(cookieParser());

accountRouter.get('/', (req, res) => {
  pool.query('SELECT * FROM account', (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error retrieving accounts');
    } else {
      res.json(result.rows);
    }
  });
});

accountRouter.get('/:id', (req, res) => {
  const accountId = req.params.id;
  pool.query('SELECT * FROM account WHERE id = $1', [accountId], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send(`Error retrieving account with ID ${accountId}`);
    } else {
      res.json(result.rows[0]);
    }
  });
});

accountRouter.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  await addAccount(first_name, last_name, email, password, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error creating account');
    } else {
      res.json(result.rows[0]);
    }
  })
});

accountRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  await loginAccount(email, password, ((error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Server error');
    } else if (results.rows.length === 0) {
      res.status(401).send('Invalid email or password');
    } else {
      const session = {
        email: email,
      };

      /** @todo: replace 'user-auth' with JWT_KEY env variable */
      const token = jwt.sign(session, 'user-auth');
      res.cookie('session', token, { httpOnly: false });
      res.send({ success: true, token });
    }
  }));

});

accountRouter.post('/verify', async (req, res) => {
  const sessionCookie = req.cookies.session;

  if (!sessionCookie) {
    res.status(401).send('Authentication failure');
    return;
  }

  const decodedSessionCookie = jwt.decode(sessionCookie);
  const email = decodedSessionCookie.email;
  await findUserByEmail(email, ((error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Server error');
    } else if (results.rows.length === 0) {
      res.status(401).send('Authentication failure');
    } else {
      res.status(200).send('Authentication success');
    }
  }));

});

export default accountRouter;
