import React, { useEffect, useState } from "react";
import { socket } from "./socketClientConnection";
import RenderBoard from "./RenderBoard";
import Winner from "./Winner";
import Loser from "./Loser";
import OpponentLeft from "./OpponentLeft";
import './playarea.css'

socket.connect();
const ChessArea = () => {
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState("Connecting...");
  const [color, setColor] = useState(null);
  const [gameFinish, setGameFinish] = useState(null);

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

    socket.on("gameOver", (msg) => {
      setGameFinish(msg.message);
    });

    socket.on("OpponentLeft", () => {
      setGameFinish("OpponentLeft");
    });

    return () => {
      socket.off("connect");
      socket.off("waiting");
      socket.off("gameStart");
      socket.off("gameOver");
      socket.off("OpponentLeft");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="chess-container">
      <h2>{status}</h2>
      <p>Opponent: {opponent}</p>
      <p>{color}</p>

      {gameFinish === "Won" && <Winner />}
      {gameFinish === "Lose" && <Loser />}
      {gameFinish === "OpponentLeft" && <OpponentLeft />}
      {gameFinish === null && status === "Connected" && (

        <RenderBoard socket={socket} color={color} />
      )}
    </div>
  );
};

export default ChessArea;
