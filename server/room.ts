import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

function getActiveRooms(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  const activeRooms: any = [];

  Object.keys(io.sockets.adapter.rooms).forEach((room) => {
    let isRoom = true;
    Object.keys(io.sockets.adapter.sids).forEach((sid) => {
      isRoom = sid === room ? false : isRoom;
    });
    if (isRoom) activeRooms.push(room);
  });

  console.log(activeRooms);

  return activeRooms;
}

export { getActiveRooms };
