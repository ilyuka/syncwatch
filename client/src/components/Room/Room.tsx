import { useEffect, useState } from "react";
import Chat from "../Chat/Chat";

let joined = false;

export default function Room({ socket, create, room, name }) {
  console.log("room mounted");
  const [allUsers, setAllUsers] = useState([]);

  const updateUsers = (allUsers) => {
    console.log("client recieved getUsers", allUsers);
    setAllUsers(allUsers);
  };

  useEffect(() => {
    console.log("enter");

    if (!joined) {
      joined = true;

      socket.on("getUsers", updateUsers);

      socket.emit("join", name, room, (allUsers) => {
        // TODO: do i need this callback?
      });
    }

    // socket.on("join", () => {
    //   // TODO: in chat display `${username} joined`
    // });

    return () => {
      if (joined) {
        joined = false;
        socket.emit("leave", name, room);
        // socket.off("getUsers", updateUsers);
      }
      console.log("leave");
    };
  }, [socket, room, name]);

  return (
    <div>
      <h1>room {room}</h1>
      <ul>
        all users
        {allUsers.map((user) => {
          return <li key={user.name}>{user.name}</li>;
        })}
      </ul>
      <Chat socket={socket} room={room} name={name}></Chat>
    </div>
  );
}
