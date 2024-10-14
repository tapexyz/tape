import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { createContext, useContext } from "react";

type ServiceWorkerContextType = {
  addEventToQueue: (name: string, properties?: Record<string, unknown>) => void;
};

const ServiceWorkerContext = createContext<ServiceWorkerContextType | null>(
  null
);

export const useServiceWorker = () => {
  const context = useContext(ServiceWorkerContext);
  if (!context) {
    throw new Error(
      "[SW] useServiceWorker must be used within a ServiceWorker contextrovider"
    );
  }
  return context;
};

export const ServiceWorkerProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .then((registration) => console.info("⚙︎ ", registration.scope))
        .catch((error) => console.error("⚙︎ ", error));
    }
  }, []);

  const addEventToQueue = () => {};

  return (
    <ServiceWorkerContext.Provider value={{ addEventToQueue }}>
      {children}
    </ServiceWorkerContext.Provider>
  );
};
