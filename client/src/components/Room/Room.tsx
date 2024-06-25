import { useEffect, useState, memo } from "react";
import Chat from "../Chat/Chat";
import MemoedUsers from "../Users/Users";

const MemoedRoom = memo(function Room({ socket, create, room, name }) {
  console.log("room mounted");

  useEffect(() => {
    socket.emit("join", name, room, () => {});

    return () => {
      socket.emit("leave", name, room);
      console.log("unmount");
    };
  }, [name, room, socket]);

  return (
    <div>
      <>
        <h1>room {room}</h1>
        <MemoedUsers socket={socket}></MemoedUsers>
        <Chat socket={socket} room={room} name={name}></Chat>
      </>
    </div>
  );
});

export default MemoedRoom;
