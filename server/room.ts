import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

function getActiveRooms(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  const activeRooms: any = [];

  Array.from(io.sockets.adapter.rooms.keys()).forEach((room) => {
    let isRoom = !Array.from(io.sockets.adapter.sids.keys()).includes(room);
    if (isRoom) {
      activeRooms.push(room);
    }
  });

  return activeRooms;
}

export { getActiveRooms };
