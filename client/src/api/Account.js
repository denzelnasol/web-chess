import axios from "axios";

const accountAxios = axios.create({
  // baseURL: process.env.REACT_APP_NODE_URL,
  baseURL: 'http://localhost:8080/api',
});

const registerAccount = async (formInfo) => {
  try {
    const data = {
      first_name: formInfo.firstName,
      last_name: formInfo.lastName,
      email: formInfo.email,
      password: formInfo.password
    };
    const response = await accountAxios.post('/account', data);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

export {
  registerAccount,
}