import "../../App.css";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();

  const joinRoom = () => {
    const randomRoomURI = encodeURIComponent("abc");

    navigate(`/room/${randomRoomURI}`);
  };

  return (
    <div>
      <h1>SyncWatch</h1>
      <button onClick={joinRoom}>Create New Room</button>
    </div>
  );
}
