import { useNavigate, useSearchParams } from "react-router-dom";
import JoinNamePrompt from "./JoinNamePrompt";

export default function Join() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const createSearchParam = searchParams.get("create");
  const roomSearchParam = searchParams.get("room");

  const name = localStorage.getItem("name");

  if (name != null && name !== "") {
    if (createSearchParam === "true") {
      navigate(`/room/${roomSearchParam}?create=${createSearchParam}`);
    } else {
      navigate(`/room/${roomSearchParam}`);
    }
    return;
  }

  return <JoinNamePrompt></JoinNamePrompt>;
}
