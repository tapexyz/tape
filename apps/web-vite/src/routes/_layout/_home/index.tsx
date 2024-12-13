import { HomePage } from "@/components/home/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_home/")({
  component: HomePage
});
