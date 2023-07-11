/**
 * useAuthService provides access to v1/auth endpoint
 */
export function useAuthService() {
  // /**
  //  * Get the signed state string for OAuth2 state parameter
  //  */
  // async function getOAuthState(): Promise<string> {
  //   try {
  //     const resp = await axios({
  //       method: "get",
  //       url: `${import.meta.env.VITE_API_URI}/v1/auth/oauth-state`,
  //     });
  //     return Promise.resolve(resp.data.data.state);
  //   } catch (e) {
  //     return Promise.reject(handleAxiosError(e));
  //   }
  // }

  return {};
}
