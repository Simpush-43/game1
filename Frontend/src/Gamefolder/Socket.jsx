// Socket.js
import { io } from "socket.io-client";

const socket = io('wss://game1-production.up.railway.app',{
   transports: ['websocket'],
  withCredentials:true
}); // Use your backend URL & port

export default socket;
