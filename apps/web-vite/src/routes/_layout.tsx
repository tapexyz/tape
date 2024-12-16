import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { meQuery } from "@/queries/account";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  loader: ({ context }) => context.rqClient.ensureQueryData(meQuery),
  component: () => {
    return (
      <main className="container mx-auto flex min-h-screen max-w-screen-2xl flex-col px-2">
        <Header />
        <Outlet />
        <Footer />
      </main>
    );
  }
});
