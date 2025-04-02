import React, { useState, useRef, useEffect } from "react";
import "./chessboardStyle.css";

export default function App({ socket }) {
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

  const [board, setBoard] = useState([...resetChessBoard]);
  
  const pieceUnicode = {
    R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙",
    r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",
  };
  const parseFEN=(fen)=> {
    const rows = fen.split(" ")[0].split("/");
    return rows.map(row => {
      let expandedRow = [];
      for (let char of row) {
        if (!isNaN(char)) {
          expandedRow.push(...Array(parseInt(char)).fill(null)); // Empty squares
        } else {
          expandedRow.push(char);
        }
      }
      return expandedRow;
    });
  }
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

    const move = {
      from: `${String.fromCharCode(97 + draggedFrom.current.colIndex)}${8 - draggedFrom.current.rowIndex}`,
      to: `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`,
      moveFromRow: draggedFrom.current.rowIndex,
      moveFromCol: draggedFrom.current.colIndex,
      moveToRow: rowIndex,
      moveToCol: colIndex,
      promotion: 'q',
    };

    socket.emit("move", move);
    draggedItem.current = null;
    draggedFrom.current = null;
  };

  useEffect(() => {
    socket.on("gamestart", () => {
      setBoard([...resetChessBoard]);
    });

    // socket.on("move", (newMove) => {
    //   console.log(newMove);
    //   setBoard((prevBoard) => {
    //     const newBoard = prevBoard.map((row) => [...row]);
    //     const currentItem = newBoard[newMove.moveFromRow][newMove.moveFromCol];
    //     newBoard[newMove.moveFromRow][newMove.moveFromCol] = null;
    //     newBoard[newMove.moveToRow][newMove.moveToCol] = currentItem;
    //     return newBoard;
    //   });
    socket.on("move", (newMove) => {
      console.log(newMove);
      const newBoard=parseFEN(newMove);
      setBoard(newBoard);
      });
    return () => {
      socket.off("move");
      socket.off("gamestart");
    };
  }, [socket]);

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
            {rowIndex === 0 && <div className="gridMarkBox">{`${String.fromCharCode(97 + colIndex)}`}</div>}
            {colIndex === 0 && <div className="gridMarkBox">{`${8 - rowIndex}`}</div>}
            {rowIndex === 7 && <div className="gridMarkBox">{`${String.fromCharCode(97 + colIndex)}`}</div>}
            {colIndex === 7 && <div className="gridMarkBox">{`${8 - rowIndex}`}</div>}
          </div>
        ))
      )}
    </div>
  );
}
