import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgres://denzelnasol@localhost:5432/web_chess',
});

const getGame = async (id) => {
  try {
    const query = 'SELECT * FROM game WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
  
    return rows[0]
  } catch (e) {
    console.log(e);
  }
};

const createGame = async (ownerId) => {
  try {
    const query = 'INSERT INTO game (owner_id) VALUES ($1) RETURNING *'
    const { rows } = await pool.query(query, [ownerId]);
    return rows[0];
  } catch (e) {
    console.log(e);
  }
};

const updateMoveHistory = async (gameId, moveHistory) => {
  try {
    const queryText = 'UPDATE game SET notation = $1 WHERE id = $2 RETURNING *';
    const { rows } = await pool.query(queryText, [moveHistory, gameId]);
    return rows[0];
  } catch (e) {
    console.log(e);
  }
};

export {
  getGame,
  createGame,
  updateMoveHistory,
}
