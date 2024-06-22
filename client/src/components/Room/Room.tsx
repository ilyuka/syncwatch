import { useEffect } from "react";

export default function Room({ socket, create, room, name }) {
  console.log("room mounted");

  useEffect(() => {
    socket.emit("join", name, room);
    return () => {};
  }, []);
  return <div>room</div>;
}
