import { createLazyFileRoute } from "@tanstack/react-router";
import { OpenPage } from "./~components/page";

export const Route = createLazyFileRoute("/open/")({
  component: OpenPage
});
