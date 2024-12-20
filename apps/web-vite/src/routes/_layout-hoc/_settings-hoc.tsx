import { Sidebar } from "@/components/settings/sidebar";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout-hoc/_settings-hoc")({
  component: () => {
    return (
      <div className="flex min-h-[calc(100vh-60px)] flex-col items-center rounded-card bg-theme">
        <div className="flex w-full max-w-screen-lg flex-1 gap-12 p-2 lg:py-10">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    );
  }
});
