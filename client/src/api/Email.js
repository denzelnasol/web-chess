import axios from 'axios';
import Cookies from 'js-cookie';

const emailAxios = axios.create({
  // baseURL: process.env.REACT_APP_NODE_URL,
  baseURL: 'http://localhost:8080/api/email',
});

const sendEmail = async (email, gameId) => {
    const data = {
        email,
        gameId
    };
    
    try {
        await emailAxios.post('/send', data);
    } catch (e) {
        console.log(e, 'ERRORRR');
    }
};

export {
    sendEmail
}