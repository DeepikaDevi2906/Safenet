import axios from "axios";

const API = axios.create({
  baseURL: "http://16.171.152.82:8000",
});

export default API;