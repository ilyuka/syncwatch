import { useSearchParams, useNavigate } from "react-router-dom";
import JoinNamePrompt from "./JoinNamePrompt";
import { useEffect } from "react";

export default function Join() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createSearchParam = searchParams.get("create");
  const roomSearchParam = searchParams.get("room");

  const name = localStorage.getItem("name");

  useEffect(() => {
    if (name != null && name !== "") {
      if (createSearchParam === "true") {
        navigate(`/room/${roomSearchParam}?create=${createSearchParam}`, {
          replace: true,
        });
      } else {
        navigate(`/room/${roomSearchParam}`, {
          replace: true,
        });
      }
      return;
    }
  }, [createSearchParam, roomSearchParam, name, navigate]);

  return <JoinNamePrompt></JoinNamePrompt>;
}
