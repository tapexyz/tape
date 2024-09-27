"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";

import { rqClient } from "./react-query";

export const Providers = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <QueryClientProvider client={rqClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
