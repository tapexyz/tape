import Cookies from "js-cookie";
import { create } from "zustand";

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

export const useCookieStore = create<CookieState>((set) => ({
  isAuthenticated: false,
  signIn: ({ accessToken, refreshToken, identityToken }) => {
    Cookies.set("accessToken", accessToken, { ...cookieConfig, expires: 1 });
    Cookies.set("refreshToken", refreshToken, { ...cookieConfig, expires: 7 });
    const expiryDate = new Date(new Date().getTime() + 30 * 60 * 1000); // 30 minutes
    Cookies.set("identityToken", identityToken, {
      ...cookieConfig,
      expires: expiryDate
    });
    set({ isAuthenticated: true });
  },
  signOut: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("identityToken");
    set({ isAuthenticated: false });
    localStorage.removeItem(BrowserStore.COOKIE_STORE);
  },
  hydrateAuthTokens: () => {
    return {
      accessToken: Cookies.get("accessToken") ?? "",
      refreshToken: Cookies.get("refreshToken") ?? "",
      identityToken: Cookies.get("identityToken") ?? ""
    };
  }
}));

export const signIn = (tokens: Tokens) =>
  useCookieStore.getState().signIn(tokens);
export const signOut = () => useCookieStore.getState().signOut();
export const hydrateAuthTokens = () =>
  useCookieStore.getState().hydrateAuthTokens();
