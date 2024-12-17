import { CreatePage } from "@/components/create/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout-hoc/create/")({
  component: CreatePage
});
