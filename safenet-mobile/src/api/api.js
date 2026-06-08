import axios from "axios";

const API = axios.create({
  baseURL: "http://13.48.182.195:8000",
});

export default API;