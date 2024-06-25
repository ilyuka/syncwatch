interface User {
  id: string;
  name: string;
  room: string;
}

const users: User[] = [];

const addUser = ({ id, name, room }: User) => {
  const user = { id, name, room };
  users.push(user);
  return { user };
};

const removeUser = (id: string) => {
  const index = users.findIndex((user: User) => user.id === id);
  if (index != -1) {
    return users.splice(index, 1);
  }
};

const getAllUsers = () => {
  return users;
};

const userExists = (name: string, room: string) => {
  console.log("n,r", name, room);
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const duplicateUser = users.find((user: User) => {
    return user.name === name && user.room === room;
  });

  if (duplicateUser) {
    return true;
  }
  return false;
};

const getActiveRoomsForSocket = (id: string) => {
  return users.filter((user) => user.id === id);
};

export {
  type User,
  addUser,
  removeUser,
  getAllUsers,
  userExists,
  getActiveRoomsForSocket,
};
