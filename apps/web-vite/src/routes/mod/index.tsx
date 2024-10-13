import { createFileRoute } from "@tanstack/react-router";
import { ModPage } from "./~components/page";

export const Route = createFileRoute("/mod/")({
  component: ModPage
});
