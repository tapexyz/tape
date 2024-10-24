import { Devtools } from "@/providers/dev-only";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Toaster } from "@tape.xyz/winder";
import { ThemeProvider } from "@tape.xyz/winder";
import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";
import { rqClient, rqPersister } from "./react-query";
import { ServiceWorkerProvider } from "./sw-provider";

const loadFeatures = () => import("./animations").then((res) => res.default);

export const Providers = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <PersistQueryClientProvider
      client={rqClient}
      persistOptions={{ persister: rqPersister }}
    >
      <ServiceWorkerProvider>
        <LazyMotion features={loadFeatures} strict>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
          <Devtools />
        </LazyMotion>
      </ServiceWorkerProvider>
    </PersistQueryClientProvider>
  );
};
