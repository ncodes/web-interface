import { StoreAccessTokenKey } from "../constants";

export function useSession() {
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
    hasAccessToken,
    getAccessToken,
    delAccessToken,
    setAccessToken,
  };
}
