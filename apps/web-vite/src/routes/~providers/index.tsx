import { Devtools } from "@/routes/~components/shared/dev-only";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Toaster } from "@tape.xyz/winder";
import { ThemeProvider } from "@tape.xyz/winder";
import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";
import { createIDBPersister, rqClient } from "./react-query";
import { ServiceWorkerProvider } from "./sw-provider";

const loadFeatures = () => import("./animations").then((res) => res.default);

const persister = createIDBPersister();

export const Providers = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <PersistQueryClientProvider
      client={rqClient}
      persistOptions={{ persister }}
    >
      <ServiceWorkerProvider>
        <LazyMotion features={loadFeatures} strict>
          <ThemeProvider>
            <main className="container flex min-h-screen max-w-screen-2xl flex-col">
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
          <Devtools />
        </LazyMotion>
      </ServiceWorkerProvider>
    </PersistQueryClientProvider>
  );
};
