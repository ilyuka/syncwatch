import { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  redirect,
} from "react-router-dom";
import { socket } from "../../utils/socketInit";

export default function Room() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const createSearchParam = searchParams.get("create");
  const roomNameParam = params.roomName;

  const name = localStorage.getItem("name");

  if (!name || name === null) {
    if (createSearchParam === "true") {
      return redirect(`/join?room=${roomNameParam}?create=true`);
    } else {
      return redirect(`/join?room=${roomNameParam}`);
    }
  }

  // useEffect(() => {
  //   if (!roomNameParam) {
  //     navigate("/");
  //   }
  // }, []);

  // useEffect(() => {
  //   if (createSearchParam !== "true") {
  //     socket.emit("checkIfRoomExists", roomNameParam, (exists: boolean) => {
  //       if (!exists) {
  //         navigate("/");
  //         return;
  //       }
  //     });
  //   }
  // }, []);

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
