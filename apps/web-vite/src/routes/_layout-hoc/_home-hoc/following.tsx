import { FollowingPage } from "@/components/following/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout-hoc/_home-hoc/following")({
  component: FollowingPage
});
