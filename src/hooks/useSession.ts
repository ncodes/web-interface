import { useState } from "react";
import { useInterval } from "usehooks-ts";
import { StoreAccessTokenKey } from "../constants";
import { useConnectorContext } from "./connectors/useConnectorContext";

export function useSession() {
  const { address } = useConnectorContext();
  const [token, setToken] = useState(
    localStorage.getItem(makeKey(address)) || "",
  );

  useInterval(() => {
    setToken(localStorage.getItem(makeKey(address)) || "");
  }, 500);

  function makeKey(address: string) {
    return `${StoreAccessTokenKey}:${address}`;
  }

  function hasAccessToken(address: string) {
    return !!getAccessToken(address);
  }

  function getAccessToken(address: string) {
    return localStorage.getItem(makeKey(address));
  }

  function delAccessToken(address: string) {
    localStorage.removeItem(makeKey(address));
  }

  function setAccessToken(address: string, token: string) {
    localStorage.setItem(makeKey(address), token);
  }

  return {
    token,
    hasAccessToken,
    getAccessToken,
    delAccessToken,
    setAccessToken,
  };
}
