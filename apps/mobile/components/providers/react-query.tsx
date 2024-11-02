import { QueryClient } from "@tanstack/react-query";

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
