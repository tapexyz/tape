import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

type Session = {
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthState = {
  session: Session;
  loading: boolean;
  signIn: (data: Session) => void;
  signOut: () => void;
  authenticated: boolean;
  hydrate: () => Promise<Session>;
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

export const getStorageItemAsync = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};

export const useAuthStore = create<AuthState>()((set) => ({
  session: {
    accessToken: null,
    refreshToken: null
  },
  loading: false,
  authenticated: false,
  signIn: (data: Session) => {
    const { accessToken, refreshToken } = data;
    setStorageItemAsync("accessToken", accessToken);
    setStorageItemAsync("refreshToken", refreshToken);
    set({
      session: data,
      loading: false,
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
      loading: false,
      authenticated: false
    });
  },
  hydrate: async () => {
    return {
      accessToken: await getStorageItemAsync("accessToken"),
      refreshToken: await getStorageItemAsync("refreshToken")
    } as Session;
  }
}));

export const hydrateSession = () => useAuthStore.getState().hydrate();
