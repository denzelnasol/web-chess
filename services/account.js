import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgres://denzelnasol@localhost:5432/web_chess',
});

const addAccount = async (first_name, last_name, email, password, callback) => {
  const query = 'INSERT INTO account (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *'
  pool.query(query, [first_name, last_name, email, password], callback);
};

const loginAccount = async (email, password, callback) => {
  const query = 'SELECT * FROM account WHERE email = $1 AND password = $2';
  pool.query(query, [email, password], callback);
}

const findUserByEmail = async (email, callback) => {
  const query = 'SELECT * FROM account WHERE email = $1';
  pool.query(query, [email], callback);
}

export {
  addAccount,
  loginAccount,
  findUserByEmail,
}