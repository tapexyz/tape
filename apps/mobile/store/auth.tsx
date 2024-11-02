import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

type Session = {
  accessToken: string | null;
  refreshToken: string | null;
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

const accessToken = getStorageItem("accessToken");
const refreshToken = getStorageItem("refreshToken");

export const useAuthStore = create<AuthState>()((set) => ({
  session: {
    accessToken: null,
    refreshToken: null
  },
  authenticated: Boolean(accessToken) && Boolean(refreshToken),
  signIn: (data: Session) => {
    const { accessToken, refreshToken } = data;
    setStorageItemAsync("accessToken", accessToken);
    setStorageItemAsync("refreshToken", refreshToken);
    set({
      session: data,
      authenticated: Boolean(accessToken) && Boolean(refreshToken)
    });
  },
  signOut: () => {
    setStorageItemAsync("accessToken", null);
    setStorageItemAsync("refreshToken", null);
    set({
      session: {
        accessToken: null,
        refreshToken: null
      },
      authenticated: false
    });
  },
  hydrate: () => {
    return { accessToken, refreshToken } as Session;
  }
}));

export const hydrateSession = () => useAuthStore.getState().hydrate();
