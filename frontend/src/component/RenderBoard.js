import React, { useState, useRef, useEffect } from "react";
import "./chessboardStyle.css";

export default function App({ socket }) {
const resetChessBoard = useState([
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ]);
  const [board, setBoard] = useState([
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["r", "n", "b", "q", "k", "b", "n", "r"],
  ]);

  const pieceUnicode = {
    R: "♖",
    N: "♘",
    B: "♗",
    Q: "♕",
    K: "♔",
    P: "♙",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
    p: "♟",
  };

  const draggedItem = useRef(null);
  const draggedFrom = useRef(null);

  const handleDragStart = (e, rowIndex, colIndex) => {
    draggedItem.current = board[rowIndex][colIndex];
    draggedFrom.current = { rowIndex, colIndex };
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, rowIndex, colIndex) => {
    e.preventDefault();
    const move = {
      from: `${String.fromCharCode(97 + draggedFrom.current.colIndex)}${8 - draggedFrom.current.rowIndex}`,
      to: `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`,
      moveFromRow: draggedFrom.current.rowIndex,
      moveFromCol: draggedFrom.current.colIndex,
      moveToRow: rowIndex,
      moveToCol: colIndex,
      promotion: 'q', // Default promotion, handle if needed
    };

    console.log("Attempting move:", move);
    draggedItem.current = null;
    draggedFrom.current = null;
    socket.emit("move", move);
  };

  useEffect(() => {

    socket.on("gamestart",()=>{
        console.log("gameStart");
        setBoard(resetChessBoard);
    })
    socket.on("move", (newMove) => {
      const newBoard = board.map((row) => [...row]);
      const currentItem = newBoard[newMove.moveFromRow][newMove.moveFromCol];
      newBoard[newMove.moveFromRow][newMove.moveFromCol] = null;
      newBoard[newMove.moveToRow][newMove.moveToCol] = currentItem;
      setBoard(newBoard);
    });

    // Cleanup listener when component unmounts or socket changes
    return () => {
      socket.off("move");
    };
  }, [socket, board]);

  return (
    <div className="chess-board">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`square ${
              (rowIndex + colIndex) % 2 === 0 ? "white" : "black"
            }`}
            draggable={piece ? "true" : "false"}
            onDragStart={(e) => handleDragStart(e, rowIndex, colIndex)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
          >
            {piece && <span className="piece">{pieceUnicode[piece]}</span>}
          </div>
        ))
      )}
    </div>
  );
}
