import { createLazyFileRoute } from "@tanstack/react-router";
import { WinderPage } from "./~components/page";

export const Route = createLazyFileRoute("/winder/")({
  component: WinderPage
});
