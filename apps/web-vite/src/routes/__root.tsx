import "@tape.xyz/winder/src/winder.css";
import { Providers } from "@/providers";
import type { QueryClient } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext
} from "@tanstack/react-router";
import { Button, EmptyState } from "@tape.xyz/winder";

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
  errorComponent: () => (
    <div className="grid min-h-screen place-items-center">
      <EmptyState
        title="Internal Error"
        description="An error occurred while rendering this page.
        Please try again later."
      />
    </div>
  ),
  notFoundComponent: () => {
    return (
      <div className="grid min-h-screen place-items-center">
        <EmptyState
          title="Page Not Found"
          description="The page you are looking for does not exist."
          action={
            <Link to="/">
              <Button variant="outline">Start Over</Button>
            </Link>
          }
        />
      </div>
    );
  }
});
