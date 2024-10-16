import { TopNav } from "@/components/shared/top-nav";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: () => {
    return (
      <>
        <TopNav />
        <Outlet />
      </>
    );
  }
});
