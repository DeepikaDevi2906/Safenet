import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.17.222.130:5000', // Use your local network IP
});

export default api;
