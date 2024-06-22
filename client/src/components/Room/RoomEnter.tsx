import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { socket } from "../../utils/socketInit";

export default function RoomEnter() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const createSearchParam = searchParams.get("create");
  const roomNameParam = params.roomName;

  const name = localStorage.getItem("name");

  const stoppedRef = useRef(false);

  // check if room exists, but only if '?create' is not true
  useEffect(() => {
    if (roomNameParam && createSearchParam !== "true") {
      socket.emit("checkIfRoomExists", roomNameParam, (exists: boolean) => {
        if (!exists) {
          stoppedRef.current = true;
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
  }, []);

  // check if user with same username is in the room
  /* could be same name and same socket.id (in case of client js navigation) */
  useEffect(() => {
    if (stoppedRef.current) {
      return;
    }
  }, []);

  return <div>room</div>;

  const [room, setRoom] = useState(params.roomName);

  let passedAllChecks = true;

  useEffect(() => {
    const localStorageUsername = localStorage.getItem("name");
    if (!localStorageUsername || localStorageUsername === "") {
      passedAllChecks = false;
      navigate(`/join?room=${params.roomName}`);
    }
  }, [params.roomName, navigate]);

  const [currUser, setCurrUser] = useState({
    id: "",
    name: JSON.parse(localStorage.getItem("name")),
  });

  useEffect(() => {
    if (!passedAllChecks) {
      return;
    }
    localStorage.setItem("name", JSON.stringify(currUser.name));
  }, [currUser.name]);

  useEffect(() => {
    if (!passedAllChecks) {
      return;
    }
    socket.emit("checkUser", currUser.name, room, (error: string) => {
      if (error) {
        // notify that user with the same name is in the room
        // other effects are still firing
        // navigate("/");
      }
    });
  }, [currUser.name, navigate, room]);

  useEffect(() => {
    if (!passedAllChecks) {
      return;
    }
    socket.emit("wantsToJoin", currUser.name, room);
  }, []);

  useEffect(() => {
    if (!passedAllChecks) {
      return;
    }
    socket.emit("checkIfRoomExists", room, (exists) => {
      console.log("exists", exists);
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
