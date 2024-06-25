import { memo, useEffect, useState } from "react";

const MemoedUsers = memo(function Users({ socket }) {
  console.log("users mounted");

  const [roomUsers, setUsers] = useState([]);

  const updateUsers = (allUsers) => {
    console.log("client recieved getUsers", allUsers);
    setUsers(allUsers);
  };

  useEffect(() => {
    socket.on("getUsers", (roomUsers) => {
      updateUsers(roomUsers);
    });
  }, [socket]);

  return (
    <div>
      {roomUsers.map((user) => {
        return <li>{user.name}</li>;
      })}
    </div>
  );
});

export default MemoedUsers;
