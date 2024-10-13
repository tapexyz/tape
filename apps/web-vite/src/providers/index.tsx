import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { Toaster } from "@tape.xyz/winder";

import { Devtools } from "@/components/shared/dev-only";
import { ThemeProvider } from "@tape.xyz/winder";
import { LazyMotion } from "framer-motion";
import { rqClient } from "./react-query";

const loadFeatures = () => import("./animations").then((res) => res.default);

export const Providers = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <QueryClientProvider client={rqClient}>
      <LazyMotion features={loadFeatures}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
        <Devtools />
      </LazyMotion>
    </QueryClientProvider>
  );
};
