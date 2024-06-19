import io from "socket.io-client";

const SERVER_URL: string = import.meta.env.VITE_SERVER_URL;

const socket = io(SERVER_URL);

export { socket };
