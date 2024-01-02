import { StoreAccessTokenKey } from "../constants";

export function useSession() {
  function hasAccessToken() {
    return !!getAccessToken();
  }

  function getAccessToken() {
    return localStorage.getItem(StoreAccessTokenKey);
  }

  function delAccessToken() {
    localStorage.removeItem(StoreAccessTokenKey);
  }

  function setAccessToken(token: string) {
    localStorage.setItem(StoreAccessTokenKey, token);
  }

  return {
    hasAccessToken,
    getAccessToken,
    delAccessToken,
    setAccessToken,
  };
}
