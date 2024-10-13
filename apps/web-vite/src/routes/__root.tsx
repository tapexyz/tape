import "@tape.xyz/winder/src/winder.css";
import type { QueryClient } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext
} from "@tanstack/react-router";
import { Providers } from "./~providers";

type RootRouteContext = {
  rqClient: QueryClient;
};

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <Providers>
      <Outlet />
      <ScrollRestoration />
    </Providers>
  ),
  notFoundComponent: () => {
    return (
      <div>
        <p>404 Not Found</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  }
});
