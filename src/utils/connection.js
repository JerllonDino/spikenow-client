import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const baseURL = process.env.REACT_APP_BASEURL;

const myAxios = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  },
});

myAxios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers.Authorization = localStorage.getItem("token");
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default myAxios;
