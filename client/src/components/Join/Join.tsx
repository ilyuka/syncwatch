import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { socket } from "../../utils/socketInit";

export default function Join() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [nameValue, setNameValue] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const tryToJoin = () => {
    console.log("nv", nameValue);
    if (nameValue === "" || !nameValue) {
      setErrorMessage("name can't be empty!");
      return;
    }

    localStorage.setItem("name", JSON.stringify(nameValue));

    socket.emit(
      "checkUser",
      nameValue,
      searchParams.get("room"),
      (error: string) => {
        if (error) {
          setErrorMessage(error);
        } else {
          navigate(`/room/${searchParams.get("room")}`);
        }
      }
    );
  };

  return (
    <div>
      <p>tell us your name before joining</p>
      <div>
        <input
          value={nameValue}
          onChange={(e) => {
            setNameValue(e.target.value);
          }}
          type="text"
          name="name"
          id="name"
          required
        />
        <button
          onClick={() => {
            tryToJoin();
          }}
        >
          proceed
        </button>
        <p>{errorMessage}</p>
      </div>
    </div>
  );
}
