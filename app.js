const path = require("path");
const http = require("http");

const { Server } = require("socket.io");
const express = require("express");
const dotenv = require("dotenv");

//* Load Config
dotenv.config({ path: "./config/config.env" });

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//* Static Folder
// io.use(express.static(path.join(__dirname,"public")));
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

const users = {};

//* Soket middle ware>> user connection this running & next
// io.use((socket, next) => {
//   console.log(socket);
//   const token = socket.handshake.auth.token;
//   const id = true;
//   if (token == undefined) {
//     console.log("client is not connecting");
//   } else if (token != id) {
//     console.log("you can't login");
//   }
//   if (token === id) {
//     console.log("login successfuly");
//     next();
//   }
// });
//* Create Chat Name Space for server side
const chatNamespace = io.of("/chat");

//* Setup websocket
//* Listening to emit Events connection user
chatNamespace.on("connection", (socket) => {
  //*Listening to emit Events login & get username
  //* Send user online for front
  socket.on("login", (data) => {
    console.log(`${data.nickname} Connected.`);
    socket.join(data.roomNumber);
    users[socket.id] = {
      nickname: data.nickname,
      roomNumber: data.roomNumber,
    };
    chatNamespace.emit("online", users);
  });
  //* Listening to emit Events disconnect user
  socket.on("disconnect", () => {
    console.log(`User disconnected.`);
    delete users[socket.id];
    chatNamespace.emit("online", users);
  });
  //* Listening to emit Events >> "chat message" from front
  socket.on("chat message", (data) => {
    chatNamespace.to(data.roomNumber).emit("chat message", data);
  });
  //* Listening to emit Events>> "typing" & send username
  socket.on("typing", (data) => {
    socket.broadcast.in(data.roomNumber).emit("typing", data);
  });
  //* Listening to emit Events>> "pvchat" & send data to show modal
  socket.on("pvChat", (data) => {
    console.log(`Private Chat Data: ${data}`);
    console.log(data.to);
    chatNamespace.to(data.to).emit("pvChat", data);
  });
});
