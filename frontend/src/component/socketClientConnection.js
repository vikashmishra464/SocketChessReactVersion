import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000";

export const socket = io(SOCKET_SERVER_URL, { 
  transports: ["websocket"], 
  autoConnect: false // Prevent auto-connect on import 
});
