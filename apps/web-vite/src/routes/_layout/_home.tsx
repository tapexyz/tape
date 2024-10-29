import { FloatingNav } from "@/components/shared/floating-nav";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_home")({
  component: () => {
    return (
      <>
        <Outlet />
        <FloatingNav />
      </>
    );
  }
});
