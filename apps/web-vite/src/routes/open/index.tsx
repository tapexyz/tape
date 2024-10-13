import { createFileRoute } from "@tanstack/react-router";
import { OpenPage } from "./~components/page";

export const Route = createFileRoute("/open/")({
  component: OpenPage
});
