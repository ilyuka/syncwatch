import http from "node:http";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import socketIO from "socket.io";
import { router } from "./router";
import { getActiveRooms } from "./room";
import {
  type User,
  addUser,
  removeUser,
  getAllUsers,
  userExists,
  getActiveRoomsForSocket,
  getRoomUsers,
} from "./user";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const httpServer = http.createServer(app);
const io = new socketIO.Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(router);

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("disconnecting", () => {
    console.log("user disconnectING ", socket.rooms);
  });
  // JOIN, LEAVE, USER
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.rooms);
    const rooms = getActiveRoomsForSocket(socket.id);

    removeUser(socket.id);

    let name: null | string = null;
    rooms.forEach((user: User) => {
      if (!name) {
        name = user.name;
      }
      console.log("emitting to", user.room);
      io.to(user.room).emit("getUsers", getAllUsers());
    });
  });

  socket.on("join", (name, room, callbackFn) => {
    console.log("all users before adding", getAllUsers());
    console.log("adding new user", socket.id, name, room);

    const { user } = addUser({ id: socket.id, name, room });
    socket.join(room);

    console.log("all users after adding", getAllUsers());

    io.to(room).emit("getUsers", getRoomUsers(room));

    io.to(room).emit("message", "admin", `${name} joined the room!`);
    socket.emit("message", "admin", "Welcome to the room!");

    return callbackFn(getRoomUsers(room));
  });

  socket.on("leave", (name, room) => {
    console.log("leaving", socket.id);
    removeUser(socket.id);
    io.to(room).emit("getUsers", getRoomUsers(room));
    io.to(room).emit("message", "admin", `${name} left the room!`);
  });

  socket.on("getUsers", (callbackFn) => {
    return callbackFn(getAllUsers());
  });

  socket.on("checkIfRoomExists", (roomName, callbackFn) => {
    console.log("checking if room exists");
    const rooms = getActiveRooms(io);
    return callbackFn(rooms.includes(roomName));
  });

  socket.on("checkUser", (name, room, callback) => {
    console.log("checking if user exists");
    console.log("all users", getAllUsers());
    const exists = userExists(name, room);
    return callback(exists);
  });

  // CHATTING
  socket.on("message", (text, room, name) => {
    console.log("sending", text, "from", name, "to room", room);
    io.to(room).emit("message", name, text);
  });
});

httpServer.listen(port, () => {
  console.log(`[server]: listening on port ${port}`);
});
