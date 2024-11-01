import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

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

export const useStorageState = (key: string): UseStateHook<string> => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    SecureStore.getItemAsync(key)
      .then((value) => {
        if (isMounted) {
          setData(value);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error retrieving storage item:", error);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [key]);

  const setValue = useCallback(
    (value: string | null) => {
      setData(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [[loading, data], setValue];
};
