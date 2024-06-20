import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage.tsx";
import Room from "./components/Room/Room.tsx";
import "./index.css";
import Join from "./components/Join/Join.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage></Homepage>,
  },
  {
    path: "/room/:roomName",
    element: <Room></Room>,
  },
  {
    path: "/join",
    element: <Join></Join>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <RouterProvider router={router}></RouterProvider>
  // </React.StrictMode>
);
