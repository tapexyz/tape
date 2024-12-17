import { Sidebar } from "@/components/settings/sidebar";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout-hoc/_settings-hoc")({
  component: () => {
    return (
      <div className="flex min-h-[calc(100vh-60px)] flex-col items-center rounded-card bg-theme">
        <div className="mt-10 flex w-full max-w-screen-lg flex-1 gap-12 px-2">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    );
  }
});
