import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function JoinNamePrompt() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const createSearchParam = searchParams.get("create");
  const roomSearchParam = searchParams.get("room");

  const [nameValue, setNameValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    if (!nameValue || nameValue.trim() === "") {
      setErrorMessage("cant use empty nickname");
      return;
    }

    localStorage.setItem("name", JSON.stringify(nameValue));

    if (createSearchParam === "true") {
      navigate(`/room/${roomSearchParam}?create=${createSearchParam}`, {
        replace: true,
      });
    } else {
      navigate(`/room/${roomSearchParam}`, { replace: true });
    }
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
            handleSubmit();
          }}
        >
          proceed
        </button>
        <p>{errorMessage}</p>
      </div>
    </div>
  );
}