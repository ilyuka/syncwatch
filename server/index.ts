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
  io.emit("test", "hello");

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const rooms = getActiveRoomsForSocket(socket.id);

    removeUser(socket.id);

    rooms.forEach((user: User) => {
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

    io.to(room).emit("getUsers", getAllUsers());

    return callbackFn(getAllUsers());
  });

  socket.on("leave", (name, room) => {
    console.log("leaving", socket.id);
    removeUser(socket.id);
    io.to(room).emit("getUsers", getAllUsers());
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
});

httpServer.listen(port, () => {
  console.log(`[server]: listening on port ${port}`);
});
