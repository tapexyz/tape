import { shouldRefreshTokens } from "@/helpers/parse-jwt";
import Cookies from "js-cookie";
import { create } from "zustand";

const COOKIE_KEYS = {
  STORE: "tape.cookie.store",
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  IDENTITY_TOKEN: "identityToken"
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
  identityToken: string;
};

type CookieState = {
  isAuthenticated: boolean;
  signIn: (tokens: Tokens) => void;
  signOut: () => void;
  hydrateAuthTokens: () => Tokens;
};

const cookieConfig: Cookies.CookieAttributes = {
  sameSite: "strict",
  secure: true
};

export const useCookieStore = create<CookieState>((set) => {
  const accessToken = Cookies.get(COOKIE_KEYS.ACCESS_TOKEN) ?? "";
  const refreshToken = Cookies.get(COOKIE_KEYS.REFRESH_TOKEN) ?? "";

  return {
    isAuthenticated: Boolean(refreshToken) && !shouldRefreshTokens(accessToken),
    signIn: ({ accessToken, refreshToken, identityToken }) => {
      const expiryDate = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 minutes

      Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
        ...cookieConfig,
        expires: expiryDate
      });
      Cookies.set(COOKIE_KEYS.IDENTITY_TOKEN, identityToken, {
        ...cookieConfig,
        expires: expiryDate
      });
      Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
        ...cookieConfig,
        expires: 7 // 7 days
      });
      set({ isAuthenticated: true });
    },
    signOut: () => {
      Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN);
      Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN);
      Cookies.remove(COOKIE_KEYS.IDENTITY_TOKEN);
      set({ isAuthenticated: false });
      localStorage.removeItem(COOKIE_KEYS.STORE);
    },
    hydrateAuthTokens: () => {
      return {
        accessToken: Cookies.get(COOKIE_KEYS.ACCESS_TOKEN) ?? "",
        refreshToken: Cookies.get(COOKIE_KEYS.REFRESH_TOKEN) ?? "",
        identityToken: Cookies.get(COOKIE_KEYS.IDENTITY_TOKEN) ?? ""
      };
    }
  };
});

export const signIn = (tokens: Tokens) =>
  useCookieStore.getState().signIn(tokens);
export const signOut = () => useCookieStore.getState().signOut();
export const hydrateAuthTokens = () =>
  useCookieStore.getState().hydrateAuthTokens();
export const isAuthenticated = () => useCookieStore.getState().isAuthenticated;
