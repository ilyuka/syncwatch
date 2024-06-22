import { useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { socket } from "../../utils/socketInit";
import Room from "./Room";

export default function RoomEnter() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const createSearchParam = searchParams.get("create");
  const roomNameParam = params.roomName;

  const name = localStorage.getItem("name");

  console.log("room enter mounted");
  let stopped = false;
  useEffect(() => {
    if (stopped) {
      return;
    }
    if (name == null || name === "") {
      console.log("here2");
      stopped = true;
      navigate(
        `/join?room=${roomNameParam}${createSearchParam ? "&create=true" : ""}`
      );
    }
  }, [createSearchParam, name, navigate, roomNameParam]);

  // check if room exists, but only if '?create' is not true
  useEffect(() => {
    if (stopped) {
      return;
    }
    if (roomNameParam && createSearchParam !== "true") {
      socket.emit("checkIfRoomExists", roomNameParam, (exists: boolean) => {
        if (!exists) {
          console.log("exists", exists);
          stopped = true;
          navigate("/", {
            state: {
              message: `Seems like room '${decodeURIComponent(
                roomNameParam
              )}' doesnt exist, check if your link is valid.`,
            },
          });
        }
      });
    }
  }, [createSearchParam, roomNameParam, navigate]);

  // check if user with same username is in the room
  /* TODO: could be same name and same socket.id (in case of client js navigation socket connection does not drop???) */
  useEffect(() => {
    console.log("here");
    if (stopped) {
      return;
    }
    socket.emit("checkUser", name, roomNameParam, (error?: string) => {
      if (error) {
        console.log("error", error);
        stopped = true;
        navigate(`/join?room=${roomNameParam}`, {
          state: {
            message: error,
          },
        });
      }
    });
  }, [name, navigate, roomNameParam]);

  if (stopped) return <div>stopped</div>;

  return (
    <Room
      socket={socket}
      create={createSearchParam}
      room={roomNameParam}
      name={name}
    ></Room>
  );
}
