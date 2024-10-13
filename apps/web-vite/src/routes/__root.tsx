import "@tape.xyz/winder/src/winder.css";
import { Providers } from "@/providers";
import type { QueryClient } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext
} from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{
  rqClient: QueryClient;
}>()({
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
