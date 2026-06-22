import axios from "axios";
// const API_URL = "http://192.168.0.103:5000";

export const api = axios.create({
  baseURL: "http://192.168.100.68:5000",
});