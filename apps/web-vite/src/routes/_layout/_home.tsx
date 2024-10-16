import { BottomNav } from "@/components/shared/bottom-nav";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_home")({
  component: () => {
    return (
      <>
        <Outlet />
        <BottomNav />
      </>
    );
  }
});
