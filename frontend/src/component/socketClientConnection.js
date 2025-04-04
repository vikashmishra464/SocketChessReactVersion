import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://sodukusolverreactversion.onrender.com";

export const socket = io(SOCKET_SERVER_URL, { 
  transports: ["websocket"], 
  autoConnect: false // Prevent auto-connect on import 
});
