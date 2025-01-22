import { authInstance} from "@/app/_api/setupAxios";

export const LOGIN_URL = "/manager/login";
export const postLogin = (payload) => authInstance.post(LOGIN_URL, payload);

export const TOKEN_LOGIN_URL = '/manager/access-token';
export const postTokenLogin = () => {
  return authInstance.post(TOKEN_LOGIN_URL);
}
