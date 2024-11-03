import NetInfo from "@react-native-community/netinfo";
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
          gcTime: 10 * 60 * 1000,
          staleTime: 60 * 60 * 1000,
          retry: 2
        }
      }
    });
  }
  return gQueryClient;
};

export const rqClient = getQueryClient();
