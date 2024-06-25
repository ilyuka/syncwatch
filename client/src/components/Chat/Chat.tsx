import { useState, useEffect } from "react";

interface Message {
  //   id: string;
  name: string;
  text: string;
  // color?
}

export default function Chat({ socket, room, name }) {
  console.log("mounting chat");

  const [messages, setMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState("");

  const sendMessage = () => {
    socket.emit("message", inputValue, room, name);
  };

  useEffect(() => {
    console.log("inside chat effect");

    socket.on("message", (name: string, text: string) => {
      console.log("client socket message");
      const newMessages = [...messages];
      newMessages.push({ name, text });
      setMessages(newMessages);
      setInputValue("");
    });
  }, [socket, messages]);

  return (
    <div>
      <div>
        {messages.map((msg) => {
          return (
            <p key={`${msg.name + msg.text}`}>
              {msg.name}: {msg.text}
            </p>
          );
        })}
      </div>
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
          }}
        >
          send
        </button>
      </div>
    </div>
  );
}
