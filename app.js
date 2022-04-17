const path = require("path");
const http = require("http");

const { Server } = require("socket.io");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const { user_Disconnect, join_User, save_Message } = require("./utils/helper");

//* Load Config
dotenv.config({ path: "./config/config.env" });

//* Database connection
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//* BodyPaser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//* Static Folder
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

const users = {};

//* Create Chat Name Space for server side
const chatNamespace = io.of("/chat");

//* Setup websocket
//* Listening to emit Events connection user
chatNamespace.on("connection", (socket) => {
  //*Listening to emit Events login & get username
  //* Send user online for front
  socket.on("login", (data) => {
    console.log(`${data.nickname} Connected.`);
    //* Push joins user to DB
    const p_user = join_User(socket.id, data.nickname, data.roomNumber);
    socket.join(data.roomNumber);
    users[socket.id] = {
      nickname: data.nickname,
      roomNumber: data.roomNumber,
    };
    chatNamespace.emit("online", users);
    socket.emit("welcome", p_user);
    socket.broadcast.in(p_user.roomNumber).emit("joined", {
      text: `${p_user.nickname} has joined the chat ${p_user.roomNumber}`,
    });
  });
  //* Listening to emit Events disconnect user
  socket.on("disconnect", async () => {
    console.log(`User disconnected.`);
    delete users[socket.id];
    const user = await user_Disconnect(socket.id);
    chatNamespace.emit("online", users);
    chatNamespace.to(user.roomNumber).emit("status", {
      text: `${user.nickname} has left the ${user.roomNumber}`,
    });
  });
  //* Listening to emit Events >> "chat message" from front
  socket.on("chat message", (data) => {
    chatNamespace.to(data.roomNumber).emit("chat message", data);
    const u_message = save_Message(socket.id, data.roomNumber, data.message);
    console.log("out put message is ....", u_message);
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
