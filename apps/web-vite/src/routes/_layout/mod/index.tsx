import { ModPage } from "@/components/mod/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/mod/")({
  component: ModPage
});
