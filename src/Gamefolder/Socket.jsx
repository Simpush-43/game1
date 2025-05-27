// Socket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL,{
  withCredentials:true
}); // Use your backend URL & port

export default socket;
