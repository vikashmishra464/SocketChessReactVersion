import React, { useEffect, useState } from "react";
import { socket } from "./socketClientConnection";
import RenderBoard from "./RenderBoard";

socket.connect();
console.log(socket);
const ChessArea = () => {
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState("Connecting...");
  const [color,setColor]=useState(null);

  useEffect(() => {

    socket.on("connect", () => {
      setStatus("Waiting for Opponent");
    });

    socket.on("waiting", (msg) => {
      setStatus(msg.message);
    });

    socket.on("gameStart", (msg) => {
      setOpponent(msg.opponent);
      setColor(msg.color);
      setStatus("Connected");
    });

    socket.on("OpponentLeft", (msg) => {
      setOpponent(null);
      setStatus(msg.message);
    });

    return () => {
      socket.off("connect");
      socket.off("waiting");
      socket.off("gameStart");
      socket.off("OpponentLeft");

      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>{status}</h2>
      <p>Opponent: {opponent}</p>
      <p>{color}</p>
      {status === "Connected" && <RenderBoard socket={socket} color={color} />}

    </div>
  );
};

export default ChessArea;
