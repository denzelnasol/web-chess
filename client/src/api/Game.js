import axios from "axios";

const accountAxios = axios.create({
  // baseURL: process.env.REACT_APP_NODE_URL,
  baseURL: 'http://localhost:8080/api/game',
});

const createGame = async (formInfo) => {
  try {
    const data = {
    };
    const response = await accountAxios.post('/create', data, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export {
  createGame,
};
