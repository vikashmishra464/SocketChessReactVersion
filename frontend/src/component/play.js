import React, { useEffect, useState } from "react";
import { socket } from "./socketClientConnection";
// import { Chessboard } from "react-chessboard";
import RenderBoard from "./RenderBoard";
const ChessArea = () => {
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState("Connecting...");
  const [color,setColor]=useState(null);

  useEffect(() => {
    socket.connect(); // Connect only when ChessGame is mounted

    socket.on("connect", () => {
      setStatus("Waiting for Opponent");
    });
    

    socket.on("waiting", (msg) => {
      setStatus(msg.message);
    });

    socket.on("gameStart", (msg) => {
      setOpponent(msg.opponent);
      setColor(msg.color);
      setStatus("In a match");
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
      <RenderBoard socket={socket}/>
    </div>
  );
};

export default ChessArea;
