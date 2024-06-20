import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../utils/socketInit";

export default function Room() {
  const navigate = useNavigate();
  const params = useParams();

  const [room, setRoom] = useState(params.roomName);

  let passedAllChecks = true;

  if (!params.roomName) {
    navigate("/");
  }

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
