import "@tape.xyz/winder/src/winder.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/home/page.tsx";
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
  }
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>
);
