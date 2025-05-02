import { QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
  if (!browserQueryClient) {
    browserQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: 10 * 60 * 1000, // 10 minutes
          staleTime: 60 * 60 * 1000, // 1 hour
          refetchOnWindowFocus: false
        }
      }
    });
  }
  return browserQueryClient;
};

export const rqClient = getQueryClient();
