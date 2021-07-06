import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const baseURL = process.env.REACT_APP_BASEURL;

const myAxios = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

myAxios.interceptors.request.use(
  function (config) {
    console.log(baseURL);
    // Do something before request is sent
    config.headers.Authorization = sessionStorage.getItem("token");
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default myAxios;
