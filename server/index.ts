import http from "node:http";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import socketIO from "socket.io";
import { router } from "./router";
import { getActiveRooms } from "./room";
import { addUser, removeUser, getAllUsers, userExists } from "./user";

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
    removeUser(socket.id);
  });

  socket.on("wantsToJoin", (name, room) => {
    const { user } = addUser({ id: socket.id, name, room });
    console.log(getAllUsers());
    socket.join(room);
  });

  socket.on("checkIfRoomExists", (roomName, callbackFn) => {
    const rooms = getActiveRooms(io);
    return callbackFn(rooms.includes(roomName));
  });

  socket.on("checkUser", (name, room, callback) => {
    const { error } = userExists(name, room);
    if (error) {
      return callback(error);
    }
    return callback();
  });
});

httpServer.listen(port, () => {
  console.log(`[server]: listening on port ${port}`);
});
