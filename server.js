const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder to serve
app.use(express.static(path.join(__dirname, "client")));

//SET Socket Io config
io.on("connection", (socket) => {
  socket.on("voiceEmit", (blob) => {
    console.log("Recieved and emmiting back");
    socket.broadcast.emit("voiceRecieve", blob);
  });
});
const PORT = 3000;
//Listen app
server.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
