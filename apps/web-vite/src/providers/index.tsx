import { Devtools } from "@/providers/dev-only";
import { useScrollStore } from "@/store/scroll";
import { QueryClientProvider } from "@tanstack/react-query";
import { ScrollArea, Toaster } from "@tape.xyz/winder";
import { ThemeProvider } from "@tape.xyz/winder";
import { LazyMotion } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";
import { Log } from "./log";
import { rqClient } from "./react-query";
import { ServiceWorkerProvider } from "./sw-provider";
import { WalletProvider } from "./wallet";

const loadFeatures = () => import("./animations").then((res) => res.default);

export const Providers = ({ children }: Readonly<{ children: ReactNode }>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const setScrollRef = useScrollStore((state) => state.setScrollRef);

  useEffect(() => {
    if (scrollRef.current) {
      setScrollRef(scrollRef);
    }
  }, [scrollRef]);

  return (
    <ScrollArea ref={scrollRef} className="h-screen">
      <QueryClientProvider client={rqClient}>
        <WalletProvider>
          <ServiceWorkerProvider>
            <LazyMotion features={loadFeatures} strict>
              <ThemeProvider>
                {children}
                <Toaster />
              </ThemeProvider>
              <Log />
              <Devtools />
            </LazyMotion>
          </ServiceWorkerProvider>
        </WalletProvider>
      </QueryClientProvider>
    </ScrollArea>
  );
};
