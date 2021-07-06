import { io } from "socket.io-client";
import dotenv from "dotenv";
dotenv.config();

const baseURL = process.env.REACT_APP_BASEURL;

const URL = baseURL;
const socket = io(URL, { autoConnect: false });

// const userInfo = sessionStorage;

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
