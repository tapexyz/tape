import { createLazyFileRoute } from "@tanstack/react-router";
import { ModPage } from "./~components/page";

export const Route = createLazyFileRoute("/mod/")({
  component: ModPage
});
