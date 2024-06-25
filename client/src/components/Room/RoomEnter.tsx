import { useEffect, useState } from "react";
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

  const [isChecking, setIsChecking] = useState(false);

  const [displayMessage, setDisplayMessage] =
    useState<string>("please wait...");

  console.log("room enter mounted");

  useEffect(() => {
    function hasCorrectParams(
      name: string | null,
      roomName: string | undefined
    ) {
      if (name == null || name === "") {
        return false;
      }
      if (roomName == null || roomName === "") {
        return false;
      }
      return true;
    }
    setIsChecking(true);
    if (!hasCorrectParams(name, roomNameParam)) {
      navigate(
        `/join?room=${roomNameParam}${createSearchParam ? "&create=true" : ""}`
      );
      setIsChecking(false);
      return;
    }
  }, [name, navigate, roomNameParam, createSearchParam]);

  useEffect(() => {
    async function roomAndUsernameCheck(roomName: string, name: string) {
      setDisplayMessage("checking if room exists...");
      const exists = await new Promise((resolve) => {
        socket.emit("checkIfRoomExists", roomName, (exists: boolean) => {
          console.log("exists", exists);
          setTimeout(() => {
            resolve(exists);
          }, 1000);
          // resolve(exists);
        });
      });

      setIsChecking(true);
      if (!exists && createSearchParam !== "true") {
        navigate("/", {
          state: {
            message: `Seems like room '${decodeURIComponent(
              roomNameParam as string
            )}' doesnt exist, check if your link is valid.`,
          },
        });
      }

      setDisplayMessage("checking if username is available...");
      const taken = await new Promise((resolve) => {
        socket.emit("checkUser", name, roomName, (taken: boolean) => {
          setTimeout(() => {
            resolve(taken);
          }, 1000);
          // resolve(taken);
        });
      });

      if (taken) {
        navigate(`/join?room=${roomName}`, {
          state: {
            message: "Seems like your username is taken, please change it",
          },
        });
      }
      setIsChecking(false);
    }

    if (roomNameParam != undefined && name != undefined) {
      roomAndUsernameCheck(roomNameParam, name);
    }
  }, [createSearchParam, roomNameParam, navigate, name]);

  return <div>{isChecking ? displayMessage : "room"}</div>;

  return (
    <Room
      socket={socket}
      create={createSearchParam}
      room={roomNameParam}
      name={name}
    ></Room>
  );
}
