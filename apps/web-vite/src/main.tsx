import "@tape.xyz/winder/src/winder.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { EmbedPage } from "./pages/embed/page.tsx";
import { HomePage } from "./pages/home/page.tsx";
import { ModPage } from "./pages/mod/page.tsx";
import { OpenPage } from "./pages/open/page.tsx";
import { UserPage } from "./pages/u/page.tsx";
import { WatchPage } from "./pages/watch/page.tsx";
import { WinderPage } from "./pages/winder/page.tsx";
import { Providers } from "./providers/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/winder",
    element: <WinderPage />
  },
  {
    path: "/u/:handle",
    element: <UserPage />
  },
  {
    path: "/watch/:pubId",
    element: <WatchPage />
  },
  {
    path: "/embed/:pubId",
    element: <EmbedPage />
  },
  {
    path: "/mod",
    element: <ModPage />
  },
  {
    path: "/open",
    element: <OpenPage />
  }
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>
);
