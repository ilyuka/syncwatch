import { useState, useEffect } from "react";

interface Message {
  //   id: string;
  name: string;
  text: string;
  date: number;
  // color?
}

export default function Messages({ socket }) {
  console.log("rendering messges");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    console.log("inside messages effect");

    const updateMessages = (name: string, text: string) => {
      const newMessages = [...messages];
      newMessages.push({ name, text, date: Date.now() });
      setMessages(newMessages);
    };

    socket.on("message", updateMessages);

    return () => {
      socket.off("message", updateMessages);
    };
  }, [socket, messages]);

  return (
    <ul>
      {messages.map((msg) => {
        return (
          <li
            key={`${msg.date}_${msg.name}_${msg.text}`}
          >{`${msg.name}: ${msg.text}`}</li>
        );
      })}
    </ul>
  );
}
