import { WinderPage } from "@/components/winder/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/winder/")({
  component: WinderPage
});
