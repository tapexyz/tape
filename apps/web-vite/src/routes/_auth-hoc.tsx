import { SignInFrame } from "@/components/shared/auth/frame";
import { Links } from "@/components/shared/auth/links";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth-hoc")({
  beforeLoad: ({ context }) => {
    if (context.authenticated) {
      location.href = "/";
    }
  },
  component: () => {
    return (
      <div className="relative flex h-screen w-screen overflow-hidden">
        <div className="grid h-full w-full place-items-center">
          <div className="container relative mx-auto max-w-sm border border-theme/30 bg-theme/30 p-10">
            <SignInFrame />

            <Outlet />

            <Links />
          </div>
        </div>
      </div>
    );
  }
});
