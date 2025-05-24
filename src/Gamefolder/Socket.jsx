// Socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:2929"); // Use your backend URL & port

export default socket;
