import { Footer } from "@/components/shared/footer";
import { TopNav } from "@/components/shared/top-nav";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: () => {
    return (
      <>
        <main className="container flex min-h-screen max-w-screen-2xl flex-col px-2">
          <TopNav />
          <Outlet />
          <Footer />
        </main>
      </>
    );
  }
});
