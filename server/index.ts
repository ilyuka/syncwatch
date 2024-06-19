import http from "node:http";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import socketIO from "socket.io";
import { router } from "./router";
import { getActiveRooms } from "./room";

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
  });

  socket.on("wantsToJoin", (roomName) => {
    console.log("R", roomName);
    socket.join(roomName);
    console.log(socket.rooms);
    console.log(io.sockets.adapter.rooms);
  });

  socket.on("checkIfRoomExists", ({ roomName }, callbackFn) => {
    const rooms = getActiveRooms(io);
    return callbackFn(rooms.includes(roomName));
  });
});

httpServer.listen(port, () => {
  console.log(`[server]: listening on port ${port}`);
});
