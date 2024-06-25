import { useState } from "react";

export default function Input({ socket, room, name }) {
  const [inputValue, setInputValue] = useState("");

  const sendMessage = () => {
    socket.emit("message", inputValue, room, name);
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        placeholder="Your message"
      />
      <button
        onClick={() => {
          sendMessage();
          setInputValue("");
        }}
      >
        send
      </button>
    </div>
  );
}
