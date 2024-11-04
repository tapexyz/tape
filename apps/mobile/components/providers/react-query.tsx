import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { onlineManager } from "@tanstack/react-query";

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

let gQueryClient: QueryClient | undefined;

const getQueryClient = () => {
  if (!gQueryClient) {
    gQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: 1000 * 60 * 60 * 24,
          retry: 2
        }
      }
    });
  }
  return gQueryClient;
};

export const rqClient = getQueryClient();
export const rqPersister = createAsyncStoragePersister({
  storage: AsyncStorage
});
