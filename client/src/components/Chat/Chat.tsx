import { memo } from "react";
import Messages from "./Messages";
import Input from "./Input";

export default memo(function Chat({ socket, room, name }) {
  console.log("mounting chat");

  return (
    <div>
      <Messages socket={socket}></Messages>
      <Input socket={socket} room={room} name={name}></Input>
    </div>
  );
});
