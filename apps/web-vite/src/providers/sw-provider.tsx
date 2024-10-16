import { IS_PRODUCTION } from "@tape.xyz/constants";
import { type ReactNode, useEffect } from "react";
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

export const ServiceWorkerProvider = ({
  children
}: Readonly<{ children: ReactNode }>) => {
  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .then((registration) => console.info("⚙︎ ", registration.scope))
        .catch((error) => console.error("⚙︎ ", error));
    }
  };

  useEffect(() => {
    if (IS_PRODUCTION) {
      registerServiceWorker();
    }
  }, []);

  const addEventToQueue = () => {};

  return (
    <ServiceWorkerContext.Provider value={{ addEventToQueue }}>
      {children}
    </ServiceWorkerContext.Provider>
  );
};
