import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

type Session = {
  accessToken: string | null;
  refreshToken: string | null;
  id: string | null;
};

type AuthState = {
  session: Session;
  signIn: (data: Session) => void;
  signOut: () => void;
  authenticated: boolean;
  hydrate: () => Session;
};

const setStorageItemAsync = async (key: string, value: string | null) => {
  try {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error("Error setting storage item:", error);
  }
};

export const getStorageItem = (key: string) => {
  return SecureStore.getItem(key);
};

const id = getStorageItem("id");
const accessToken = getStorageItem("accessToken");
const refreshToken = getStorageItem("refreshToken");

export const useAuthStore = create<AuthState>()((set) => ({
  session: {
    id,
    accessToken,
    refreshToken
  },
  authenticated: Boolean(accessToken) && Boolean(refreshToken),
  signIn: (data: Session) => {
    const { accessToken, refreshToken, id } = data;
    setStorageItemAsync("id", id);
    setStorageItemAsync("accessToken", accessToken);
    setStorageItemAsync("refreshToken", refreshToken);
    set({
      session: data,
      authenticated: Boolean(accessToken) && Boolean(refreshToken)
    });
  },
  signOut: () => {
    setStorageItemAsync("id", null);
    setStorageItemAsync("accessToken", null);
    setStorageItemAsync("refreshToken", null);
    set({
      session: {
        accessToken: null,
        refreshToken: null,
        id: null
      },
      authenticated: false
    });
  },
  hydrate: () => {
    return { accessToken, refreshToken, id } as Session;
  }
}));

export const hydrateSession = () => useAuthStore.getState().hydrate();
export const signIn = (tokens: Session) =>
  useAuthStore.getState().signIn(tokens);
