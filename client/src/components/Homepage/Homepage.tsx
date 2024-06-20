import "../../App.css";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();

  const joinRoom = () => {
    const randomRoomURI = encodeURIComponent("abc");
    navigate(`/join?room=${randomRoomURI}&create=true`);
  };

  return (
    <div>
      <h1>SyncWatch</h1>
      <button onClick={joinRoom}>Create New Room</button>
    </div>
  );
}
