import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RefCodeKey } from "../constants";

export default function RefPage() {
  const { code } = useParams();
  const prevRefCode = localStorage.getItem(RefCodeKey);
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/tapwar");
  }, []);

  if (code && !prevRefCode) {
    localStorage.setItem(RefCodeKey, code);
  }

  return null;
}
