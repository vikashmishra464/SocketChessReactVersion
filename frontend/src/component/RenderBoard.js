import React, { useState, useRef, useEffect } from "react";
import "./chessboardStyle.css";

export default function App({ socket, color }) {
  const resetChessBoard = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ];

  const [board, setBoard] = useState(() => JSON.parse(JSON.stringify(resetChessBoard)));
  
  const pieceUnicode = {
    R: "\u2656", N: "\u2658", B: "\u2657", Q: "\u2655", K: "\u2654", P: "\u2659",
    r: "\u265C", n: "\u265E", b: "\u265D", q: "\u265B", k: "\u265A", p: "\u265F",
  };

  const parseFEN = (fen) => {
    return fen.split(" ")[0].split("/").map(row => {
      let expandedRow = [];
      for (let char of row) {
        if (!isNaN(char)) {
          expandedRow.push(...Array(parseInt(char)).fill(null));
        } else {
          expandedRow.push(char);
        }
      }
      return expandedRow;
    });
  };

  const draggedItem = useRef(null);
  const draggedFrom = useRef(null);

  const handleDragStart = (e, rowIndex, colIndex) => {
    if (!board[rowIndex][colIndex]) return;
    draggedItem.current = board[rowIndex][colIndex];
    draggedFrom.current = { rowIndex, colIndex };
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, rowIndex, colIndex) => {
    e.preventDefault();
    if (!draggedFrom.current) return;
    if (color === "black" && 'A' <= draggedItem.current && draggedItem.current <= 'Z') return;
    if (color === "white" && 'a' <= draggedItem.current && draggedItem.current <= 'z') return;

    const move = {
      from: `${String.fromCharCode(97 + draggedFrom.current.colIndex)}${8 - draggedFrom.current.rowIndex}`,
      to: `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`,
      promotion: 'q',
    };

    socket.emit("move", move);
    draggedItem.current = null;
    draggedFrom.current = null;
  };

  useEffect(() => {
    const handleGameStart = () => setBoard(JSON.parse(JSON.stringify(resetChessBoard)));
    const handleMove = (newMove) => setBoard(parseFEN(newMove));

    socket.on("gamestart", handleGameStart);
    socket.on("move", handleMove);

    return () => {
      socket.off("gamestart", handleGameStart);
      socket.off("move", handleMove);
    };
  }, []);

  return (
    <div className="chess-board">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`square ${(rowIndex + colIndex) % 2 === 0 ? "white" : "black"}`}
            draggable={!!piece}
            onDragStart={(e) => handleDragStart(e, rowIndex, colIndex)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
          >
            {piece && <span className="piece">{pieceUnicode[piece]}</span>}
            {(rowIndex === 0 || rowIndex === 7) && <div className="gridMarkBox">{`${String.fromCharCode(97 + colIndex)}`}</div>}
            {(colIndex === 0 || colIndex === 7) && <div className="gridMarkBox">{`${8 - rowIndex}`}</div>}
          </div>
        ))
      )}
    </div>
  );
}
