import axios from "axios";

const API = axios.create({
  baseURL: "http://10.232.31.135:8000",
});

export default API;