import { createContext, useContext } from "react";

type ServiceWorkerContextType = {
  addEventToQueue: (name: string, properties?: Record<string, unknown>) => void;
};

export const ServiceWorkerContext = createContext<
  ServiceWorkerContextType | undefined
>(undefined);

const useSw = () => {
  const context = useContext(ServiceWorkerContext);
  if (!context) {
    throw new Error("[SW] useSw must be used within a ServiceWorkerProvider");
  }
  return context;
};

export default useSw;
