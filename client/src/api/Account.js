import axios from "axios";
import Cookies from "js-cookie";

const accountAxios = axios.create({
  // baseURL: process.env.REACT_APP_NODE_URL,
  baseURL: 'http://localhost:8080/api/account',
});

const registerAccount = async (formInfo) => {
  try {
    const data = {
      first_name: formInfo.firstName,
      last_name: formInfo.lastName,
      email: formInfo.email,
      password: formInfo.password
    };
    const response = await accountAxios.post('/register', data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const loginAccount = async (formInfo) => {
  try {
    const data = {
      email: formInfo.email,
      password: formInfo.password
    };

    const response = await accountAxios.post('/login', data, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const verifyAccount = async () => {
  try {
    const response = await accountAxios.post('/verify', undefined, { withCredentials: true });
    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export {
  registerAccount,
  loginAccount,
  verifyAccount,
}