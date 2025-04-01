const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const Chess = require('chess.js').Chess;
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const chess=new Chess();
let waiting_Players = [];
let active_Games = {};

io.on("connection", (socket) => {
    console.log("New Player Connected:", socket.id);

    if (waiting_Players.length > 0) {
        const firstPlayer = socket;
        const secondPlayer = waiting_Players.shift();

        active_Games[firstPlayer.id] = secondPlayer.id;
        active_Games[secondPlayer.id] = firstPlayer.id;

        firstPlayer.emit("gameStart", { opponent: secondPlayer.id,color:"white" });
        secondPlayer.emit("gameStart", { opponent: firstPlayer.id,color:"black"});
        console.log("Match started:", firstPlayer.id, secondPlayer.id);
    } 
    else {
        waiting_Players.push(socket);
        socket.emit("waiting", { message: "Waiting for player" });
    }
    socket.on("move",(msg)=>{
        const newMove={from:msg.from,to:msg.to,promotion:msg.promotion};
        const moveIsValid=chess.move(newMove);
        console.log(moveIsValid);
        if(moveIsValid!==null){
            const opponentId=active_Games[socket.id];
            console.log(opponentId);
            if(opponentId){
                const opponent = io.sockets.sockets.get(opponentId);
                
                const validMove={
                    moveFromRow:msg.moveFromRow,
                    moveFromCol:msg.moveFromCol,
                    moveToRow:msg.moveToRow,
                    moveToCol:msg.moveFromCol
                }
                opponent.emit("move",validMove);
                socket.emit("move",validMove);
            }
        }
    })

    socket.on("disconnect", () => {
        console.log(`Player ${socket.id} disconnected`);
        const opponentId = active_Games[socket.id];
        if (opponentId) {
            const opponent = io.sockets.sockets.get(opponentId);
            if (opponent) {
                opponent.emit("OpponentLeft", { message: "Opponent Left the match" });
            }
            delete active_Games[socket.id];
            delete active_Games[opponentId];
        }

        waiting_Players = waiting_Players.filter(player => player.id !== socket.id);
    });
});
const move = {
    from: `${String.fromCharCode(97 + 3)}${8 - 5}`,
    to: `${String.fromCharCode(97 + 5)}${8 - 2}`,
    promotion: 'q',
};
console.log(move);

// console.log(chess.fen());
app.get("/play", (req, res) => {
    res.send("Welcome to the play route! 🎮");
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
