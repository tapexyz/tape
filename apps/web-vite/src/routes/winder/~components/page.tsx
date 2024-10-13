import { Suspense, lazy } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

const Content = lazy(() =>
  import("./content").then((m) => ({ default: m.Content }))
);

export const WinderPage = () => {
  return (
    <div className="container min-h-screen max-w-6xl overflow-x-hidden md:overflow-x-visible">
      <Header />
      <div className="min-w-[300px] md:grid md:grid-cols-[250px_1fr]">
        <Sidebar />
        <Suspense>
          <Content />
        </Suspense>
      </div>
    </div>
  );
};
