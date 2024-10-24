import { QueryClient } from "@tanstack/react-query";
import type {
  PersistedClient,
  Persister
} from "@tanstack/react-query-persist-client";
import { createStore, del, get, set } from "idb-keyval";

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
  if (!browserQueryClient) {
    browserQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          // gcTime: 10 * 60 * 1000,
          // staleTime: 60 * 60 * 1000,
          gcTime: 1000 * 60 * 60 * 24,
          refetchOnWindowFocus: false
        }
      }
    });
  }
  return browserQueryClient;
};

const store = createStore("tape-store", "query-client");
export const createIDBPersister = (idbValidKey: IDBValidKey = "data-store") => {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client, store);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey, store);
    },
    removeClient: async () => {
      await del(idbValidKey, store);
    }
  } as Persister;
};

export const rqClient = getQueryClient();
export const rqPersister = createIDBPersister();
