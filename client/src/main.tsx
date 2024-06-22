import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Homepage from "./components/Homepage/Homepage.tsx";
import RoomEnter from "./components/Room/RoomEnter.tsx";
import "./index.css";
import Join from "./components/Join/Join.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage></Homepage>,
  },
  {
    path: "/room/:roomName",
    element: <RoomEnter></RoomEnter>,
    loader({ request, params }) {
      const url = new URL(request.url);
      const name = localStorage.getItem("name");
      const create = url.searchParams.get("create");
      const room = params.roomName;

      if (name == null || name === "") {
        if (create === "true") {
          return redirect(`/join?room=${room}?create=true`);
        } else {
          return redirect(`/join?room=${room}`);
        }
      }
      return null;
    },
  },
  {
    path: "/join",
    element: <Join></Join>,
    loader: ({ request }) => {
      const url = new URL(request.url);
      const name = localStorage.getItem("name");
      const create = url.searchParams.get("create");
      const room = url.searchParams.get("room");

      if (name != null && name !== "") {
        if (create === "true") {
          return redirect(`/room/${room}?create=true`);
        } else {
          return redirect(`/room/${room}`);
        }
      }
      return null;
    },
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <RouterProvider router={router}></RouterProvider>
  // </React.StrictMode>
);
