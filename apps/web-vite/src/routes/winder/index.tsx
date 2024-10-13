import { createFileRoute } from "@tanstack/react-router";
import { WinderPage } from "./~components/page";

export const Route = createFileRoute("/winder/")({
  component: WinderPage
});
