"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { Toaster } from "@tape.xyz/winder";

import { Devtools } from "@/components/shared/dev-only";
import { rqClient } from "./react-query";
import { ThemeProvider } from "./theme";

export const Providers = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <QueryClientProvider client={rqClient}>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
      <Devtools />
    </QueryClientProvider>
  );
};
