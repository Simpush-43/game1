// Socket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL,{
   transports: ['websocket'],
  withCredentials:true
}); // Use your backend URL & port

export default socket;
