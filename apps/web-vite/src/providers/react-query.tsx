import { QueryClient } from "@tanstack/react-query";

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 10 * 60 * 1000,
        staleTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false
      }
    }
  });
};

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
};

export const rqClient = getQueryClient();
