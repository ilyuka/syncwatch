import { useState } from "react";
import "../../App.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState(location.state.message);

  const joinRoom = () => {
    const randomRoomURI = encodeURIComponent("abc");
    navigate(`/join?room=${randomRoomURI}&create=true`);
  };

  return (
    <div>
      <p>{message}</p>
      <h1>SyncWatch</h1>
      <button onClick={joinRoom}>Create New Room</button>
    </div>
  );
}
