import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../utils/socketInit";

export default function Room() {
  const params = useParams();

  useEffect(() => {
    socket.on("connection", (socket) => {
      console.log("client socket", socket);
    });
  }, []);

  return (
    <div>
      room {params.roomName}
      <button
        onClick={() => {
          socket.emit("test");
        }}
      >
        tyk
      </button>
    </div>
  );
}
