import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgres://denzelnasol@localhost:5432/web_chess',
});


const accountRouter = express.Router();

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

accountRouter.post('/', (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  pool.query('INSERT INTO account (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, email, password], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error creating account');
    } else {
      res.json(result.rows[0]);
    }
  });
});

accountRouter.put('/:id', (req, res) => {
  const accountId = req.params.id;
  const { first_name, last_name, email, password } = req.body;
  pool.query('UPDATE account SET first_name = $1, last_name = $2, email = $3, password = $4 WHERE id = $5 RETURNING *', [first_name, last_name, email, password, accountId], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send(`Error updating account with ID ${accountId}`);
    } else {
      res.json(result.rows[0]);
    }
  });
});

accountRouter.delete('/:id', (req, res) => {
  const accountId = req.params.id;
  pool.query('DELETE FROM account WHERE id = $1', [accountId], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send(`Error deleting account with ID ${accountId}`);
    } else {
      res.send(`Account with ID ${accountId} deleted`);
    }
  });
});

export default accountRouter;
