import { HomePage } from "@/components/home/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout-hoc/_home-hoc/")({
  component: HomePage
});
