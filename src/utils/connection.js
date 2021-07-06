import axios from "axios";

const myAxios = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

myAxios.interceptors.request.use(
  function (config) {
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
