import { LocalStore } from "@tape.xyz/lens/custom-types";
import Cookies from "js-cookie";
import { create } from "zustand";

import { setActiveProfile } from "./idb/profile";

type Tokens = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
};

interface AuthState {
  signIn: (tokens: {
    accessToken: string;
    refreshToken: string;
    identityToken: string;
  }) => void;
  signOut: () => void;
  hydrateAuthTokens: () => Tokens;
}

const cookieConfig: Cookies.CookieAttributes = {
  sameSite: "strict",
  secure: true
};

const useAuthPersistStore = create<AuthState>(() => ({
  signIn: ({ accessToken, refreshToken, identityToken }) => {
    Cookies.set("accessToken", accessToken, { ...cookieConfig, expires: 1 });
    Cookies.set("refreshToken", refreshToken, { ...cookieConfig, expires: 7 });
    const expiryDate = new Date(new Date().getTime() + 30 * 60 * 1000); // 30 minutes
    Cookies.set("identityToken", identityToken, {
      ...cookieConfig,
      expires: expiryDate
    });
  },
  signOut: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("identityToken");
    localStorage.removeItem(LocalStore.TAPE_STORE);
    localStorage.removeItem(LocalStore.WAGMI_STORE);
    setActiveProfile(null);
  },
  hydrateAuthTokens: () => {
    return {
      accessToken: Cookies.get("accessToken"),
      refreshToken: Cookies.get("refreshToken"),
      identityToken: Cookies.get("identityToken")
    };
  }
}));

export default useAuthPersistStore;

export const signIn = (tokens: {
  accessToken: string;
  refreshToken: string;
  identityToken: string;
}) => useAuthPersistStore.getState().signIn(tokens);
export const signOut = () => useAuthPersistStore.getState().signOut();
export const hydrateAuthTokens = () =>
  useAuthPersistStore.getState().hydrateAuthTokens();
