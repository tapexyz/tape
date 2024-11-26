import "./main.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { rqClient } from "./providers/react-query";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  context: {
    rqClient
  },
  defaultPreload: "intent",
  // cache will be managed by the react-query
  defaultPreloadStaleTime: 0
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("__tape__") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
