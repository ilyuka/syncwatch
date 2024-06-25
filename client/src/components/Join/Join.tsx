import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function Join() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const createSearchParam = searchParams.get("create");
  const roomSearchParam = searchParams.get("room");

  const [nameValue, setNameValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const name = localStorage.getItem("name");

  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    setIsChecking(true);
    if (!location.state) {
      navigate("/", {
        state: { message: "Please check if your link is valid" },
      });
      return;
    }
    setIsChecking(false);
  }, [location.state, navigate]);

  const handleSubmit = () => {
    if (!nameValue || nameValue.trim() === "") {
      setErrorMessage("cant use empty nickname");
      return;
    }

    localStorage.setItem("name", nameValue);

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
      {isChecking ? (
        "please wait..."
      ) : (
        <>
          <p>{location.state?.message && location.state?.message}</p>
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
            {name && location.state?.canUseOldUsername === true && (
              <button
                onClick={() => {
                  if (createSearchParam === "true") {
                    navigate(
                      `/room/${roomSearchParam}?create=${createSearchParam}`,
                      {
                        replace: true,
                      }
                    );
                  } else {
                    navigate(`/room/${roomSearchParam}`, { replace: true });
                  }
                }}
              >
                use {name}
              </button>
            )}
            <p>{errorMessage}</p>
          </div>
        </>
      )}
    </div>
  );
}
