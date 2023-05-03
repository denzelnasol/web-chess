import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgres://denzelnasol@localhost:5432/web_chess',
});

const addAccount = async (first_name, last_name, email, password) => {
  const query = 'INSERT INTO account (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *'
  const { rows } = await pool.query(query, [first_name, last_name, email, password]);
  return rows[0];
};

const loginAccount = async (email, password) => {
  const query = 'SELECT * FROM account WHERE email = $1 AND password = $2';
  const { rows } = await pool.query(query, [email, password]);

  if (rows.length === 0) {
    return undefined;
  } else {
    return rows[0];
  }
};

const findAccountByEmail = async (email) => {
  const query = 'SELECT * FROM account WHERE email = $1';
  const { rows } = await pool.query(query, [email]);

  if (rows.length === 0) {
    return undefined;
  } else {
    return rows[0];
  }
}

export {
  addAccount,
  loginAccount,
  findAccountByEmail,
}