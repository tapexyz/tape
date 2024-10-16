import { createFileRoute } from "@tanstack/react-router";
import { ModPage } from "./~components/page";

export const Route = createFileRoute("/(app)/_layout/mod/")({
  component: ModPage
});
