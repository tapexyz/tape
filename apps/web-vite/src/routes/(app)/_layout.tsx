import { Outlet, createFileRoute } from "@tanstack/react-router";
import { TopNav } from "../~components/shared/top-nav";

export const Route = createFileRoute("/(app)/_layout")({
  component: () => {
    return (
      <>
        <TopNav />
        <Outlet />
      </>
    );
  }
});
