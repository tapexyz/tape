import "@tape.xyz/winder/src/winder.css";
import { Providers } from "@/providers";
import type { QueryClient } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  createRootRouteWithContext
} from "@tanstack/react-router";
import { TAPE_X_HANDLE } from "@tape.xyz/constants";
import { Button, EmptyState } from "@tape.xyz/winder";

type RootRouteContext = {
  rqClient: QueryClient;
  authenticated: boolean;
};

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <Providers>
      <Outlet />
    </Providers>
  ),
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center">
      <EmptyState
        title="Internal Error"
        description="An error occurred while rendering this page."
        more={
          <div className="flex flex-col items-center gap-2">
            <pre className="max-w-sm overflow-auto whitespace-pre-wrap rounded-custom bg-theme/40 p-5 text-xs">
              <code>{error.message}</code>
            </pre>
            <span className="flex items-center gap-1 text-muted text-sm">
              <span>Please report</span>
              <a
                href={`https://x.com/${TAPE_X_HANDLE}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block underline"
              >
                @{TAPE_X_HANDLE}
              </a>
            </span>
          </div>
        }
      />
    </div>
  ),
  notFoundComponent: () => {
    return (
      <div className="grid min-h-screen place-items-center">
        <EmptyState
          title="Page Not Found"
          description="The page you are looking for does not exist."
          more={
            <Link to="/">
              <Button variant="outline">Start Over</Button>
            </Link>
          }
        />
      </div>
    );
  }
});
