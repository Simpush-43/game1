// Socket.js
import { io } from "socket.io-client";

const socket = io('https://game1-r4h2.onrender.com',{
   transports: ['websocket'],
  withCredentials:true
}); // Use your backend URL & port

export default socket;
