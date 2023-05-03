import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgres://denzelnasol@localhost:5432/web_chess',
});

const addGame = async (stuff, callback) => {
  const query = 'INSERT INTO game (stuff here) VALUES ($stuff) RETURNING *'
  pool.query(query, [stuff], callback);
};

export {
  addGame,
}
