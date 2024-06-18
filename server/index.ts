import http from "node:http";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import socketIO from "socket.io";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const httpServer = http.createServer(app);
const io = new socketIO.Server(httpServer);

app.get("/", (req: Request, res: Response) => {
  res.send("server response");
});

app.use(cors());
app.listen(port, () => {
  console.log(`[server]: listening on port ${port}`);
});
