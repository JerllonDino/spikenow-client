import { io } from "socket.io-client";
import dotenv from "dotenv";
dotenv.config();

const baseURL =
  process.env.REACT_APP_BASEURL + ":" + process.env.REACT_APP_BASEPORT;

// const URL = baseURL;
const socket = io(baseURL, { autoConnect: false });

// const userInfo = localStorage;

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
