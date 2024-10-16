import { OpenPage } from "@/components/open/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/open/")({
  component: OpenPage
});
