import axios from "axios";

const gameAxios = axios.create({
  // baseURL: process.env.REACT_APP_NODE_URL,
  baseURL: 'http://localhost:8080/api/game',
});

const getGame = async (id) => {
  const options = {
    withCredentials: true,
  }

  try {
    const response = await gameAxios.get(`/${id}`, options);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const createGame = async (formInfo) => {
  try {
    const response = await gameAxios.post('/create', undefined, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateMoveHistory = async (gameId, moveHistory) => {
  try {
    const data = {
      gameId,
      moveHistory,
    }
    const response = await gameAxios.post('/', data, { withCredentials: true });
    return response.data; 
  } catch (error) {
    console.log(error);
    return null;
  }
}

export {
  getGame,
  createGame,
  updateMoveHistory,
};
